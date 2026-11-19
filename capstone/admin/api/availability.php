<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");

require_once __DIR__ . "/db.php";

// Availability is read with GET requests only.
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["message" => "Use a GET request."]);
    exit;
}

// This endpoint needs the numeric facility ID from the database.
$facilityId = $_GET["facility_id"] ?? "";

if (!ctype_digit($facilityId)) {
    http_response_code(400);
    echo json_encode(["message" => "A valid facility_id is required."]);
    exit;
}

try {
    // Pending and approved requests make a time unavailable.
    // Rejected requests are ignored.
    $sql = "
        SELECT
            DATE_FORMAT(r.start_datetime, '%Y-%m-%dT%H:%i') AS start,
            DATE_FORMAT(r.end_datetime, '%Y-%m-%dT%H:%i') AS end
        FROM sarf_req AS r
        INNER JOIN sarf AS s ON s.id = r.sarf_id
        WHERE r.facility_id = :facility_id
          AND s.status IN ('pending', 'approved')
          AND r.end_datetime >= NOW()
        ORDER BY r.start_datetime
    ";

    $statement = $pdo->prepare($sql);
    $statement->execute(["facility_id" => (int) $facilityId]);

    echo json_encode($statement->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $error) {
    http_response_code(500);
    echo json_encode(["message" => "Could not load availability."]);
}