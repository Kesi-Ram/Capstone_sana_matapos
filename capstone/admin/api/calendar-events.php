
<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/db.php";

// Retrieve scheduled reservations and their facility names.
$sql = "
    SELECT
        s.id,
        s.sarf_id,
        s.facility_id,
        s.event_title,
        s.start_datetime,
        s.end_datetime,
        s.status,
        f.name AS facility_name,
        r.control_number
    FROM schedules AS s
    LEFT JOIN facility AS f
        ON s.facility_id = f.id
    LEFT JOIN sarf AS r
        ON s.sarf_id = r.id
    WHERE s.status = 'scheduled'
    ORDER BY s.start_datetime ASC
";

$stmt = $pdo->prepare($sql);
$stmt->execute();

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$events = [];

// Convert MySQL records into FullCalendar events.
foreach ($rows as $row) {

    $events[] = [
        "id" => $row["id"],

        // Event title displayed on the calendar.
        "title" => $row["event_title"],

        // FullCalendar uses these to position the event.
        "start" => str_replace(" ", "T", $row["start_datetime"]),
        "end" => str_replace(" ", "T", $row["end_datetime"]),

        // Additional information for displaying event details.
        "extendedProps" => [
            "sarf_id" => $row["sarf_id"],
            "facility_id" => $row["facility_id"],
            "facility_name" => $row["facility_name"],
            "status" => $row["status"],
            "control_number" => $row["control_number"]
        ]
    ];
}

echo json_encode($events);
