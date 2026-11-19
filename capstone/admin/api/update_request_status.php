<?php
header("Content-Type: application/json");
require_once __DIR__ . "/db.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["message" => "Use POST."]);
    exit;
}

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["message" => "Admin login required."]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$id = (int)($input["id"] ?? 0);
$status = $input["status"] ?? "";
$reason = trim($input["reason"] ?? "");

if ($id <= 0 || !in_array($status, ["approved", "rejected"], true)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid request or decision."]);
    exit;
}

if ($status === "rejected" && $reason === "") {
    http_response_code(400);
    echo json_encode(["message" => "Please provide a rejection reason."]);
    exit;
}

$stmt = $pdo->prepare("
    UPDATE sarf
    SET status = ?, reject_reason = ?, decided_at = NOW()
    WHERE id = ? AND status = 'pending'
");

$stmt->execute([
    $status,
    $status === "rejected" ? $reason : null,
    $id
]);

if ($stmt->rowCount() === 0) {
    http_response_code(409);
    echo json_encode(["message" => "Request not found or already processed."]);
    exit;
}

echo json_encode(["message" => "Request status updated."]);