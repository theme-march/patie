<?php
// ============================================================
// Contact Form Mail Handler
// Change the $to address to your own email before going live.
// ============================================================

$to = 'youremail@yourdomain.com';

// Sanitize and validate all POST inputs
$name    = isset($_POST['name'])    ? htmlspecialchars(strip_tags(trim($_POST['name'])),    ENT_QUOTES, 'UTF-8') : '';
$email   = isset($_POST['email'])   ? filter_var(trim($_POST['email']),   FILTER_SANITIZE_EMAIL) : '';
$subject = isset($_POST['subject']) ? htmlspecialchars(strip_tags(trim($_POST['subject'])), ENT_QUOTES, 'UTF-8') : '';
$topic   = isset($_POST['topic'])   ? htmlspecialchars(strip_tags(trim($_POST['topic'])),   ENT_QUOTES, 'UTF-8') : '';
$msg     = isset($_POST['msg'])     ? htmlspecialchars(strip_tags(trim($_POST['msg'])),     ENT_QUOTES, 'UTF-8') : '';

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Invalid email address.";
    exit;
}

// Prevent header injection in From field
$email = str_replace(["\r", "\n"], '', $email);
$name  = str_replace(["\r", "\n"], '', $name);

// Build headers
$headers  = 'From: ' . $name . ' <' . $email . '>' . "\r\n";
$headers .= 'Reply-To: ' . $email . "\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion();

// Construct email body
$body  = "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Topic: $topic\n";
$body .= "Subject: $subject\n\n";
$body .= "Message:\n$msg";

// Send email
$send = mail($to, $subject, $body, $headers);

if ($send) {
    echo "Email has been sent successfully.";
} else {
    echo "Failed to send email.";
}
?>
