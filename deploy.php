<?php
define('SECRET',    'marilabo_deploy_2026_secret');
define('SITE_PATH', '/home/phrc696439/marriage-lab.com/public_html');

$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
$payload   = file_get_contents('php://input');

if (empty($signature)) {
    http_response_code(403);
    exit('Forbidden');
}

$expected = 'sha256=' . hash_hmac('sha256', $payload, SECRET);

if (!hash_equals($expected, $signature)) {
    http_response_code(403);
    exit('Invalid signature');
}

$data = json_decode($payload, true);

if (($data['ref'] ?? '') !== 'refs/heads/main') {
    http_response_code(200);
    exit('Not main branch, skip.');
}

$output = shell_exec('cd ' . escapeshellarg(SITE_PATH) . ' && git pull origin main 2>&1');

http_response_code(200);
header('Content-Type: text/plain');
echo "Deploy triggered\n";
echo $output;
