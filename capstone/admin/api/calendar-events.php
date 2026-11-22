
<?php

session_start();

header("Content-Type: application/json");

require_once "db.php";

// Get all active schedules from the database
$sql = "SELECT
            id,
            sarf_id,
            facility_id,
            event_title,
            start_datetime,
            end_datetime,
            status
        FROM schedules
        WHERE status = 'scheduled'
        ORDER BY start_datetime ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute();

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$events = [];

// Convert MySQL records into FullCalendar events
foreach ($rows as $row) {

    $events[] = [
        "id" => $row["id"],
        "title" => $row["event_title"],
        "start" => str_replace(" ", "T", $row["start_datetime"]),
        "end" => str_replace(" ", "T", $row["end_datetime"]),

        "extendedProps" => [
            "sarf_id" => $row["sarf_id"],
            "facility_id" => $row["facility_id"],
            "status" => $row["status"]
        ]
    ];
}

echo json_encode($events);
