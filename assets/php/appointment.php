<?php
// ============================================================
// Appointment Form Mail Handler
// Change the $to address to your own email before going live.
// ============================================================

$to = 'youremail@yourdomain.com';

// Sanitize and validate all POST inputs
$name    = isset($_POST['name'])    ? htmlspecialchars(strip_tags(trim($_POST['name'])),    ENT_QUOTES, 'UTF-8') : '';
$email   = isset($_POST['email'])   ? filter_var(trim($_POST['email']),   FILTER_SANITIZE_EMAIL) : '';
$phone   = isset($_POST['phone'])   ? htmlspecialchars(strip_tags(trim($_POST['phone'])),   ENT_QUOTES, 'UTF-8') : '';
$vehicle = isset($_POST['vehicle']) ? htmlspecialchars(strip_tags(trim($_POST['vehicle'])), ENT_QUOTES, 'UTF-8') : '';
$time    = isset($_POST['time'])    ? htmlspecialchars(strip_tags(trim($_POST['time'])),    ENT_QUOTES, 'UTF-8') : '';
$date    = isset($_POST['date'])    ? htmlspecialchars(strip_tags(trim($_POST['date'])),    ENT_QUOTES, 'UTF-8') : '';
$msg     = isset($_POST['msg'])     ? htmlspecialchars(strip_tags(trim($_POST['msg'])),     ENT_QUOTES, 'UTF-8') : '';

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Invalid email address.";
    exit;
}

// Prevent header injection
$email = str_replace(["\r", "\n"], '', $email);
$name  = str_replace(["\r", "\n"], '', $name);

// Build headers
$headers  = 'From: ' . $name . ' <' . $email . '>' . "\r\n";
$headers .= 'Reply-To: ' . $email . "\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion();

$subject = 'New Appointment Request from ' . $name;

// Construct email body
$body  = "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Phone: $phone\n";
$body .= "Vehicle/Pet: $vehicle\n";
$body .= "Preferred Time: $time\n";
$body .= "Preferred Date: $date\n\n";
$body .= "Message:\n$msg";

// Send email
$send = mail($to, $subject, $body, $headers);

if ($send) {
    echo "Email has been sent successfully.";
} else {
    echo "Failed to send email.";
}
?>
