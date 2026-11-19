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

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["message" => "Use a POST request."]);
    exit;
}

require_once __DIR__ . "/db.php";

session_set_cookie_params([
    "lifetime" => 0,
    "path" => "/",
    "httponly" => true,
    "samesite" => "Lax",
]);

session_start();

$input = json_decode(file_get_contents("php://input"), true);
$email = strtolower(trim($input["email"] ?? ""));
$password = $input["password"] ?? "";

if ($email === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["message" => "Enter your email and password."]);
    exit;
}

$sql = "
    SELECT id, name, email, password_hash
    FROM requester_accounts
    WHERE email = :email
";

$statement = $pdo->prepare($sql);
$statement->execute(["email" => $email]);
$requester = $statement->fetch(PDO::FETCH_ASSOC);

if (!$requester || !password_verify($password, $requester["password_hash"])) {
    http_response_code(401);
    echo json_encode(["message" => "Email or password is incorrect."]);
    exit;
}

// Start a fresh session and remember which requester signed in.
session_regenerate_id(true);
$_SESSION = [];
$_SESSION["requester_id"] = (int) $requester["id"];

echo json_encode([
    "message" => "Signed in.",
    "requester" => [
        "id" => (int) $requester["id"],
        "name" => $requester["name"],
        "email" => $requester["email"],
    ],
]);