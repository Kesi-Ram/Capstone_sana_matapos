<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

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