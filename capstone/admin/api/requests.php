
<?php
require "db.php";
session_start();

header("Content-Type: application/json");

// Allow GET requests only
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["message" => "Use GET."]);
    exit;
}

// Check whether an admin is logged in
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["message" => "Not logged in."]);
    exit;
}

// Verify that the account still exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
$stmt->execute([$_SESSION["user_id"]]);

if (!$stmt->fetch()) {
    http_response_code(401);
    echo json_encode(["message" => "Not logged in."]);
    exit;
}

// Retrieve all reservation requests
$stmt = $pdo->query("
    SELECT
        s.id,
        s.control_number,
        s.status,
        s.created_at,
        s.decided_at,
        s.reject_reason,
        s.scan_path,

        r.name_of_organizer_office_college AS organization,
        r.name_of_program,
        r.nature_of_activity,
        r.type_of_activity,
        r.start_datetime,
        r.end_datetime,
        r.est_total_participants,
        r.participants_type,
        r.in_charge_name,
        r.in_charge_designation,
        r.in_charge_contact,
        r.in_charge_email,
        r.source_of_budget,
        r.estimated_total_budget,

        f.id AS facility_id,
        f.name AS facility

    FROM sarf s

    JOIN sarf_req r
        ON s.id = r.sarf_id

    JOIN facility f
        ON r.facility_id = f.id

    ORDER BY s.created_at DESC, s.id DESC
");

$requests = $stmt->fetchAll();

echo json_encode([
    "requests" => $requests
]);
