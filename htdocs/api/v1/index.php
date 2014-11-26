<?php
ini_set('date.timezone', 'Asia/Tokyo');


$method = $_SERVER['REQUEST_METHOD'];
$path = $_GET['_path'];
$file1 = 'json/' . $path . '.' . strtolower($method) . '.json';
$file2 = 'json/' . $path . '.json';

header("Content-Type: application/json; charset=utf-8");
usleep(rand(300, 3000) * 1000);

$contents = '';
if (file_exists($file1)) {
    $contents = file_get_contents($file1);
} else if (file_exists($file2)) {
    $contents = file_get_contents($file2);
} else {
    $contents = '{ "error": "File not found.", "files": [ "' . $file1 . '", "' . $file2 . '" ] }';
}

function toJsonString($str) {
    $before = array('/\\\\/',   '/\\r/', '/\\n/', '/\\t/', '/"/');
    $after = array( '\\\\\\\\', '\\\\r', '\\\\n', '\\\\t', '\\\\"');
    $str = preg_replace($before, $after, $str);
    return $str;
}

// <!--#include virtual=\"...\"--> で囲まれた部分をファイルを取ってきてむりやり置換する
$fileBase = '../..';
$pattern = '/<!--\\s*#include\\s+virtual=\\\\"(.+)\\\\"\\s*-->/';
$i = 0;
while (preg_match($pattern, $contents, $match)) {
    $escaped = toJsonString(file_get_contents($fileBase . $match[1]));
    $contents = str_replace($match[0], $escaped, $contents);
    $i ++;
    if ($i > 100) { echo 'break'; break; }
}

print($contents);

exit;
