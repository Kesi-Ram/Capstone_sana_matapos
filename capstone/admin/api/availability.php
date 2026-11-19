<?php

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

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