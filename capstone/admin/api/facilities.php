
<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json; charset=UTF-8");

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
