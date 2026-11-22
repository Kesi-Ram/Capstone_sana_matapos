
<?php

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/db.php";

// Get the selected facility ID.
$facilityId = (int)($_GET["facility_id"] ?? 0);

if ($facilityId <= 0) {
    http_response_code(400);

    echo json_encode([
        "message" => "Please select a valid facility."
    ]);

    exit;
}

try {
    // Get confirmed reservations for the selected facility.
    $stmt = $pdo->prepare("
        SELECT
            start_datetime,
            end_datetime
        FROM schedules
        WHERE facility_id = ?
          AND status = 'scheduled'
        ORDER BY start_datetime ASC
    ");

    $stmt->execute([$facilityId]);

    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "bookings" => $bookings
    ]);

} catch (Throwable $error) {
    error_log($error->getMessage());

    http_response_code(500);

    echo json_encode([
        "message" => "Could not load facility availability."
    ]);
}
