
<?php

header("Content-Type: application/json; charset=utf-8");

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

$allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174"
];

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/db.php";
session_start();

// Cancellation must use POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "message" => "Use POST."
    ]);
    exit;
}

// Only logged-in requesters can cancel requests.
if (!isset($_SESSION["requester_id"])) {
    http_response_code(401);

    echo json_encode([
        "message" => "Please log in first."
    ]);
    exit;
}

// Receive the SARF ID from React.
$input = json_decode(file_get_contents("php://input"), true);

$requestId = filter_var(
    $input["requestId"] ?? null,
    FILTER_VALIDATE_INT
);

if (!$requestId || $requestId <= 0) {
    http_response_code(400);

    echo json_encode([
        "message" => "A valid request ID is required."
    ]);
    exit;
}

$requesterId = (int)$_SESSION["requester_id"];

try {

    // Cancel only when:
    // 1. The SARF belongs to the logged-in requester.
    // 2. The SARF is still pending.
    $statement = $pdo->prepare(
        "UPDATE sarf
         SET status = 'cancelled'
         WHERE id = ?
           AND requester_id = ?
           AND status = 'pending'"
    );

    $statement->execute([
        $requestId,
        $requesterId
    ]);

    // If no row was updated, cancellation was not allowed.
    if ($statement->rowCount() === 0) {
        http_response_code(409);

        echo json_encode([
            "message" => "Request cannot be cancelled. It may already be processed or cancelled."
        ]);
        exit;
    }

    echo json_encode([
        "message" => "Request cancelled successfully.",
        "requestId" => $requestId,
        "status" => "cancelled"
    ]);

} catch (PDOException $error) {

    error_log($error->getMessage());

    http_response_code(500);

    echo json_encode([
        "message" => "Could not cancel the request."
    ]);
}
