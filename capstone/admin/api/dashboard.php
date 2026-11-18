<?php
require "db.php";
session_start();
header("Content-Type: application/json");

// Check if an admin is logged in
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["message" => "Not logged in."]);
    exit;
}

// Verify that the admin still exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
$stmt->execute([$_SESSION["user_id"]]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(["message" => "Not logged in."]);
    exit;
}
// Get reservation request statistics
$stmt = $pdo->query("
    SELECT
        COUNT(*) AS total_requests,
        COALESCE(SUM(status = 'pending'), 0) AS pending_requests,
        COALESCE(SUM(status = 'approved'), 0) AS approved_requests,
        COALESCE(SUM(status = 'rejected'), 0) AS rejected_requests
    FROM sarf
");

$stats = $stmt->fetch();



// Get facility statistics
$stmt = $pdo->query("
    SELECT
        COUNT(*) AS total_facilities,
        COALESCE(SUM(is_active = 1), 0) AS active_facilities
    FROM facility
");

$facilities = $stmt->fetch();


// Get the five most recent requests
$stmt = $pdo->query("
    SELECT
        s.id,
        s.control_number,
        s.status,
        s.created_at,
        s.decided_at,
        r.name_of_organizer_office_college AS organization,
        r.nature_of_activity,
        r.start_datetime,
        r.end_datetime,
        f.name AS facility
    FROM sarf s
    JOIN sarf_req r ON s.id = r.sarf_id
    JOIN facility f ON r.facility_id = f.id
    ORDER BY s.created_at DESC
    LIMIT 5
");

$recentRequests = $stmt->fetchAll();

echo json_encode([
    "stats" => $stats,
    "facilities" => $facilities,
    "recent_requests" => $recentRequests
]);