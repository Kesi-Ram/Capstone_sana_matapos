<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/db.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["message" => "Use POST."]);
    exit;
}

if (!isset($_SESSION["requester_id"])) {
    http_response_code(401);
    echo json_encode(["message" => "Please log in first."]);
    exit;
}
$input = json_decode(file_get_contents("php://input"), true);
$values = $input["values"] ?? null;

if (!is_array($values)) {
    http_response_code(400);
    echo json_encode(["message" => "Form data is missing."]);
    exit;
}

$requiredFields = [
    "activityType",
    "organization",
    "title",
    "nature",
    "start",
    "end",
    "facilityId",
    "participantsTotal",
    "personName",
    "personDesignation",
    "personContact",
    "personEmail",
];

foreach ($requiredFields as $field) {
    if (empty($values[$field])) {
        http_response_code(400);
        echo json_encode(["message" => "A required field is missing."]);
        exit;
    }

    $start = DateTime::createFromFormat("Y-m-d\TH:i", $values["start"]);
$end = DateTime::createFromFormat("Y-m-d\TH:i", $values["end"]);

if (!$start || !$end || $end <= $start) {
    http_response_code(400);
    echo json_encode(["message" => "The selected dates or times are invalid."]);
    exit;
}

$facilityId = (int)$values["facilityId"];
$participants = $values["participants"] ?? [];
$participantsText = is_array($participants)
    ? implode(", ", $participants)
    : "";

$budgetSource = trim($values["budgetSource"] ?? "");
$budget = ($values["budget"] ?? "") === "" ? null : $values["budget"];
$formData = json_encode($values, JSON_UNESCAPED_UNICODE);

try {
    $pdo->beginTransaction();

    $facilityCheck = $pdo->prepare(
        "SELECT id FROM facility WHERE id = ? AND is_active = 1"
    );
    $facilityCheck->execute([$facilityId]);

    if (!$facilityCheck->fetch()) {
        throw new Exception("The selected facility is unavailable.");
    }

    $controlNumber = "SARF-" . date("Y") . "-" . random_int(100000, 999999);

    $saveSarf = $pdo->prepare(
        "INSERT INTO sarf (requester_id, control_number, status)
         VALUES (?, ?, 'pending')"
    );
    $saveSarf->execute([$_SESSION["requester_id"], $controlNumber]);

    $sarfId = $pdo->lastInsertId();

    $saveDetails = $pdo->prepare(
        "INSERT INTO sarf_req (
            sarf_id, facility_id, type_of_activity,
            name_of_organizer_office_college, name_of_program,
            nature_of_activity, start_datetime, end_datetime,
            participants_type, est_total_participants,
            in_charge_name, in_charge_designation,
            in_charge_contact, in_charge_email,
            source_of_budget, estimated_total_budget, form_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $saveDetails->execute([
        $sarfId,
        $facilityId,
        $values["activityType"],
        $values["organization"],
        $values["title"],
        $values["nature"],
        $start->format("Y-m-d H:i:s"),
        $end->format("Y-m-d H:i:s"),
        $participantsText,
        (int)$values["participantsTotal"],
        $values["personName"],
        $values["personDesignation"],
        $values["personContact"],
        $values["personEmail"],
        $budgetSource === "" ? null : $budgetSource,
        $budget,
        $formData,
    ]);

    $pdo->commit();

    http_response_code(201);
    echo json_encode([
        "message" => "Request submitted.",
        "controlNumber" => $controlNumber,
    ]);
} catch (Throwable $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log($error->getMessage());
    http_response_code(500);
    echo json_encode(["message" => "Could not save the request."]);
}
    
}