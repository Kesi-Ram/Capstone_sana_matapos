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

session_start();
require_once __DIR__ . "/db.php";

if (!isset($_SESSION["requester_id"])) {
    http_response_code(401);
    echo json_encode(["message" => "Not logged in"]);
    exit;
}

$stmt = $pdo->prepare(
    "SELECT id, name, email FROM requester_accounts WHERE id = ?"
);
$stmt->execute([$_SESSION["requester_id"]]);
$requester = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$requester) {
    http_response_code(401);
    echo json_encode(["message" => "Requester not found"]);
    exit;
}

echo json_encode($requester);