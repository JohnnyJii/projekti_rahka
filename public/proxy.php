<?php
header('Content-type: application/json');
$url = $_GET['url'];
$handle = curl_init();
echo $url;
$url = "http://10.114.32.162";

// Set the url
curl_setopt($handle, CURLOPT_URL, $url);
// Set the result output to be a string.
curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

$output = curl_exec($handle);

curl_close($handle);

echo $output;
