<?php
require "db.php";
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["message" => "Not logged in."]);
    exit;
}

$stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE id = ?");
$stmt->execute([$_SESSION["user_id"]]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Not logged in."]);
    exit;
}

echo json_encode(["user" => $user]);