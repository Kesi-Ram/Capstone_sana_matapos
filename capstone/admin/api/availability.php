
<?php

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/db.php";

// Only GET requests are allowed.
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "message" => "Use a GET request."
    ]);

    exit;
}

// Get the selected facility ID.
$facilityId = $_GET["facility_id"] ?? "";

if (!is_string($facilityId) || !ctype_digit($facilityId) || (int)$facilityId <= 0) {
    http_response_code(400);

    echo json_encode([
        "message" => "A valid facility_id is required."
    ]);

    exit;
}

try {

    // Retrieve time ranges from confirmed schedules
    // and pending or approved SARF requests.
    $sql = "
        SELECT
            DATE_FORMAT(start_datetime, '%Y-%m-%dT%H:%i') AS start,
            DATE_FORMAT(end_datetime, '%Y-%m-%dT%H:%i') AS end
        FROM schedules
        WHERE facility_id = ?
          AND status = 'scheduled'
          AND end_datetime >= NOW()

        UNION

        SELECT
            DATE_FORMAT(r.start_datetime, '%Y-%m-%dT%H:%i') AS start,
            DATE_FORMAT(r.end_datetime, '%Y-%m-%dT%H:%i') AS end
        FROM sarf_req AS r
        INNER JOIN sarf AS s
            ON r.sarf_id = s.id
        WHERE r.facility_id = ?
          AND s.status IN ('pending', 'approved')
          AND r.end_datetime >= NOW()

        ORDER BY start
    ";

    $statement = $pdo->prepare($sql);

    $statement->execute([
        (int)$facilityId,
        (int)$facilityId
    ]);

    // Return the time ranges expected by DateTimePicker.
    echo json_encode(
        $statement->fetchAll(PDO::FETCH_ASSOC)
    );

} catch (PDOException $error) {

    error_log($error->getMessage());

    http_response_code(500);

    echo json_encode([
        "message" => "Could not load availability."
    ]);
}
