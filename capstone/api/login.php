<?php
require "db.php";
session_start();
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["message" => "Use POST."]);
    exit;
}

// React sends the email and password as JSON. This reads it.
$input    = json_decode(file_get_contents("php://input"), true);
$email    = strtolower(trim($input["email"] ?? ""));
$password = $input["password"] ?? "";

if ($email === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["message" => "Email and password are required."]);
    exit;
}

$stmt = $pdo->prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user["password_hash"])) {
    http_response_code(401);
    echo json_encode(["message" => "Invalid email or password."]);
    exit;
}

session_regenerate_id(true);
$_SESSION["user_id"] = $user["id"];

echo json_encode(["user" => [
    "id"    => $user["id"],
    "name"  => $user["name"],
    "email" => $user["email"],
]]);