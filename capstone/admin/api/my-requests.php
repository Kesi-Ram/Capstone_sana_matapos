<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/db.php";
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Use GET."]);
    exit;
}

if (!isset($_SESSION["requester_id"])) {
    http_response_code(401);
    echo json_encode(["message" => "Please log in first."]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT
        s.control_number AS id,
        r.name_of_program AS title,
        f.name AS venue,
        r.start_datetime AS date,
        s.status,
        r.form_data,
        'Submitted' AS stage
    FROM sarf s
    JOIN sarf_req r ON r.sarf_id = s.id
    JOIN facility f ON f.id = r.facility_id
    WHERE s.requester_id = ?
    ORDER BY s.created_at DESC, s.id DESC
");

$stmt->execute([$_SESSION["requester_id"]]);

echo json_encode([
    "requests" => $stmt->fetchAll()
]);