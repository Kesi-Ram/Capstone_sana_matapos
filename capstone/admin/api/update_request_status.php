
<?php
require_once __DIR__ . "/db.php";
session_start();

header("Content-Type: application/json");

// Check if an admin is logged in
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["message" => "Admin login required."]);
    exit;
}

$adminId = $_SESSION["user_id"];

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["message" => "Use POST."]);
    exit;
}

// Read the request sent by React
$input = json_decode(file_get_contents("php://input"), true);

$id = (int)($input["id"] ?? 0);
$status = $input["status"] ?? "";
$reason = trim($input["reason"] ?? "");

// Validate the request
if ($id <= 0 || !in_array($status, ["approved", "rejected"], true)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid request or decision."]);
    exit;
}

if ($status === "rejected" && $reason === "") {
    http_response_code(400);
    echo json_encode(["message" => "Please provide a rejection reason."]);
    exit;
}

$lockName = null;
$lockAcquired = false;

try {

    // STEP 1: Find the SARF request
    $stmt = $pdo->prepare("
        SELECT
            s.id,
            s.status,
            r.facility_id,
            r.name_of_program,
            r.start_datetime,
            r.end_datetime
        FROM sarf AS s
        JOIN sarf_req AS r ON r.sarf_id = s.id
        WHERE s.id = ?
    ");

    $stmt->execute([$id]);
    $request = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$request || $request["status"] !== "pending") {
        throw new RuntimeException(
            "Request not found or already processed.",
            409
        );
    }

    // STEP 2: If approving, lock this facility's scheduling process
    // This prevents two admins from booking overlapping events at once.
    if ($status === "approved") {

        $facilityId = (int)$request["facility_id"];

        if ($facilityId <= 0) {
            throw new RuntimeException("Invalid facility.", 400);
        }

        $lockName = "fmo_facility_" . $facilityId;

        $lockStmt = $pdo->prepare("SELECT GET_LOCK(?, 5)");
        $lockStmt->execute([$lockName]);

        if ((int)$lockStmt->fetchColumn() !== 1) {
            throw new RuntimeException(
                "Facility is busy processing another request. Try again.",
                409
            );
        }

        $lockAcquired = true;
    }

    // STEP 3: Start database transaction
    $pdo->beginTransaction();

    // Lock the SARF record while processing it
    $stmt = $pdo->prepare("
        SELECT status
        FROM sarf
        WHERE id = ?
        FOR UPDATE
    ");

    $stmt->execute([$id]);
    $currentStatus = $stmt->fetchColumn();

    if ($currentStatus !== "pending") {
        throw new RuntimeException(
            "Request already processed.",
            409
        );
    }

    if ($status === "approved") {

        // Check if the requested dates are valid
        $start = $request["start_datetime"];
        $end = $request["end_datetime"];

        if (!$start || !$end || strtotime($start) >= strtotime($end)) {
            throw new RuntimeException(
                "Invalid reservation date or time.",
                400
            );
        }

        // STEP 4: Check for conflicting schedules
        $stmt = $pdo->prepare("
            SELECT id
            FROM schedules
            WHERE facility_id = ?
              AND status = 'scheduled'
              AND start_datetime < ?
              AND end_datetime > ?
            LIMIT 1
        ");

        $stmt->execute([
            $facilityId,
            $end,
            $start
        ]);

        $conflict = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($conflict) {
            throw new RuntimeException(
                "This facility already has a reservation during the selected time.",
                409
            );
        }
    }

    // STEP 5: Update the SARF and save the admin ID
    $stmt = $pdo->prepare("
        UPDATE sarf
        SET status = ?,
            admin_id = ?,
            reject_reason = ?,
            decided_at = NOW()
        WHERE id = ? AND status = 'pending'
    ");

    $stmt->execute([
        $status,
        $adminId,
        $status === "rejected" ? $reason : null,
        $id
    ]);

    if ($stmt->rowCount() === 0) {
        throw new RuntimeException(
            "Request could not be updated.",
            409
        );
    }

    // STEP 6: Create the schedule only if approved
    if ($status === "approved") {

        $stmt = $pdo->prepare("
            INSERT INTO schedules
                (sarf_id, facility_id, event_title,
                 start_datetime, end_datetime, status)
            VALUES (?, ?, ?, ?, ?, 'scheduled')
        ");

        $stmt->execute([
            $id,
            $facilityId,
            $request["name_of_program"],
            $start,
            $end
        ]);
    }

    // STEP 7: Save changes
    $pdo->commit();

    echo json_encode([
        "message" => "Request " . $status . " successfully."
    ]);

} catch (Throwable $error) {

    // Undo changes if something failed
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    $code = (int)$error->getCode();

    if ($error instanceof RuntimeException &&
        in_array($code, [400, 409], true)) {

        http_response_code($code);

        echo json_encode([
            "message" => $error->getMessage()
        ]);

    } else {

        error_log($error->getMessage());

        http_response_code(500);

        echo json_encode([
            "message" => $error->getMessage()
        ]);
    }

} finally {

    // Release the facility lock after processing
    if ($lockAcquired) {
        $stmt = $pdo->prepare("SELECT RELEASE_LOCK(?)");
        $stmt->execute([$lockName]);
    }
}
