
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

// This assumes db.php is one folder above api/.
require_once __DIR__ . "/db.php";

try {
    // Get the active facilities and the details the user-side list displays.
    $sql = "
        SELECT id, name, capacity, open_time, close_time
        FROM facility
        WHERE is_active = 1
        ORDER BY name
    ";

    $statement = $pdo->query($sql);
    $rows = $statement->fetchAll(PDO::FETCH_ASSOC);

    // Prepare the database values in a format that is convenient for React.
    $facilities = [];

    foreach ($rows as $row) {
        $facilities[] = [
            "id" => (int) $row["id"],
            "name" => $row["name"],
            "capacity" => (int) $row["capacity"],
            "opens" => substr($row["open_time"], 0, 5),
            "closes" => substr($row["close_time"], 0, 5)
        ];
    }

    echo json_encode($facilities);
} catch (PDOException $error) {
    http_response_code(500);

    // Send a general message; keep database details out of the response.
    echo json_encode([
        "message" => "Could not load facilities."
    ]);
}
