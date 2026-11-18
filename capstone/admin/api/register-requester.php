<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../db.php";

// The browser may send this preliminary request before the actual POST.
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["message" => "Use a POST request."]);
    exit;
}

// Read the JSON sent by React.
$input = json_decode(file_get_contents("php://input"), true);

$name = trim($input["name"] ?? "");
$email = strtolower(trim($input["email"] ?? ""));
$password = $input["password"] ?? "";

if ($name === "" || !filter_var($email, FILTER_VALIDATE_EMAIL) || $password === "") {
    http_response_code(400);
    echo json_encode(["message" => "Enter a name, valid email, and password."]);
    exit;
}

if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(["message" => "Password must be at least 8 characters."]);
    exit;
}

// Turn the password into a safe hash before storing it.
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

try {
    $sql = "
        INSERT INTO requester_accounts (name, email, password_hash)
        VALUES (:name, :email, :password_hash)
    ";

    $statement = $pdo->prepare($sql);
    $statement->execute([
        "name" => $name,
        "email" => $email,
        "password_hash" => $passwordHash,
    ]);

    http_response_code(201);
    echo json_encode(["message" => "Requester account created."]);
} catch (PDOException $error) {
    // The table has a unique email constraint, so duplicate emails are rejected.
    if ($error->getCode() === "23000") {
        http_response_code(409);
        echo json_encode(["message" => "An account with that email already exists."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Could not create the account."]);
    }
}