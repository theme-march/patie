<?php
// ============================================================
// Footer Newsletter Subscription Handler
// Change the $to address to your own email before going live.
// ============================================================

$to = 'youremail@yourdomain.com';

// Sanitize and validate subscriber email
$footerEmail = isset($_POST['footerEmail']) ? filter_var(trim($_POST['footerEmail']), FILTER_SANITIZE_EMAIL) : '';

// Validate email
if (!filter_var($footerEmail, FILTER_VALIDATE_EMAIL)) {
    echo "Invalid email address.";
    exit;
}

// Prevent header injection
$footerEmail = str_replace(["\r", "\n"], '', $footerEmail);

// Build headers
$headers  = 'From: Newsletter Subscription <no-reply@yourdomain.com>' . "\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion();

$subject = 'New Newsletter Subscription';

// Construct email body
$body = "New subscriber email: $footerEmail";

// Send email
$send = mail($to, $subject, $body, $headers);

if ($send) {
    echo "Email has been sent successfully.";
} else {
    echo "Failed to send email.";
}
?>
