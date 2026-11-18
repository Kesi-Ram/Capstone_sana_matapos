<?php
// Only allow this to run from the terminal, never from a browser.
if (php_sapi_name() !== "cli") {
    http_response_code(403);
    exit;
}

require "db.php";

$name     = "Administrator";
$email    = "admin@campus.test";
$password = "admin123";   // placeholder for development only

$check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$check->execute([$email]);

if ($check->fetch()) {
    echo "Admin account already exists. Nothing to do.\n";
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$insert = $pdo->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
$insert->execute([$name, $email, $hash]);

echo "Created admin account: $email\n";