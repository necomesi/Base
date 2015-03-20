<?php
ini_set('date.timezone', 'Asia/Tokyo');

/* ======================================================
//
//   API ダミーシステム
//
//   リクエストに応じて、あらかじめ用意しておいた JSON をレスポンスします。
//   パラメーターの有無や値に応じて、適切な JSON をレスポンスします。
//
//   以下の例のように JSON ファイルを用意してください。
//
//   【例】hogehoge へのリクエスト
//   -> json/hogehoge/__default.json
//
//   【例】hogehoge?user_id=1 へのリクエスト
//   -> json/hogehoge/user_id=1.json
//
//   【例】hogehoge?user_id=* へのリクエスト (wildcard)
//   -> json/hogehoge/user_id.json
//
//   【例】hogehoge?user_id=10&mode=view へのリクエスト
//   -> json/hogehoge/mode=view&user_id=10.json
//
//
//   【ようするに】hogehoge?param1=1&param2=10&あ=い へのGETリクエストに対して
//   以下の優先度で JSON ファイルを探し、最初にみつけたものを返します。
//   パラメーターは文字コード順にソートされ、指定が詳細な順にファイルを探します。
//
//    1. %E3%81%82=%E3%81%84&param1=1&param2=10.get.json,
//    2. %E3%81%82=%E3%81%84&param1=1&param2=10.json,
//    3. %E3%81%82&param1=1&param2=10.get.json,
//    4. %E3%81%82=%E3%81%84&param1&param2=10.get.json,
//    5. %E3%81%82=%E3%81%84&param1=1&param2.get.json,
//    6. %E3%81%82&param1=1&param2=10.json,
//    7. %E3%81%82=%E3%81%84&param1=1&param2.json,
//    8. %E3%81%82=%E3%81%84&param1&param2=10.json,
//    9. %E3%81%82&param1=1&param2.get.json,
//   10. %E3%81%82&param1&param2=10.get.json,
//   11. %E3%81%82=%E3%81%84&param1&param2.get.json,
//   12. %E3%81%82&param1&param2=10.json,
//   13. %E3%81%82&param1=1&param2.json,
//   14. %E3%81%82=%E3%81%84&param1&param2.json,
//   15. %E3%81%82&param1&param2.get.json,
//   16. %E3%81%82&param1&param2.json,
//   17. %E3%81%82=%E3%81%84&param1=1.get.json,
//   18. %E3%81%82=%E3%81%84&param2=10.get.json,
//   19. param1=1&param2=10.get.json,
//   20. %E3%81%82=%E3%81%84&param1=1.json,
//   21. %E3%81%82=%E3%81%84&param2=10.json,
//   22. param1=1&param2=10.json,
//   23. %E3%81%82=%E3%81%84&param1.get.json,
//   24. %E3%81%82&param1=1.get.json,
//   25. %E3%81%82&param2=10.get.json,
//   26. %E3%81%82=%E3%81%84&param2.get.json,
//   27. param1=1&param2.get.json,
//   28. param1&param2=10.get.json,
//   29. %E3%81%82&param1=1.json,
//   30. %E3%81%82=%E3%81%84&param1.json,
//   31. %E3%81%82&param2=10.json,
//   32. %E3%81%82=%E3%81%84&param2.json,
//   33. param1&param2=10.json,
//   34. param1=1&param2.json,
//   35. %E3%81%82&param1.get.json,
//   36. %E3%81%82&param2.get.json,
//   37. param1&param2.get.json,
//   38. %E3%81%82&param1.json,
//   39. %E3%81%82&param2.json,
//   40. param1&param2.json,
//   41. %E3%81%82=%E3%81%84.get.json,
//   42. param1=1.get.json,
//   43. param2=10.get.json,
//   44. %E3%81%82=%E3%81%84.json,
//   45. param1=1.json,
//   46. param2=10.json,
//   47. %E3%81%82.get.json,
//   48. param1.get.json,
//   49. param2.get.json,
//   50. %E3%81%82.json,
//   51. param1.json,
//   52. param2.json,
//   53. __default.get.json,
//   54. __default.json
//
//   探したディレクトリ、探したファイルの順番、最終的に使用したファイルは
//   レスポンス JSON の中にメタ情報として含まれるので、
//   デバッグ時に活用してください。
//
// ====================================================== */


/* ======================================================
// 設定
// ------------------------------------------------------ */

// ブリッジする場合の URL
$apiBase = 'http://bridge.example.com/v1/';

// ブリッジするかどうか
$bridge = false;

// $bridge = false でも、例外的にブリッジして読みに行く API
$apiBridge = array(
  'example/api',
);

// 無視するパラメータ名
$ignoreParams = array('_');

// パラメーターの区切り
$paramSeparator = '&';
//$paramSeparator = ';';

// 擬似 SSI を使用するかどうか
$useSSI = true;

// （擬似 SSI を使用する場合）ドキュメントルートとなるディレクトリまでの相対パス
$ssiRoot = '../..';


/* ======================================================
// 前準備
// ------------------------------------------------------ */

// メソッドによって出力を変える
$method = strtolower($_SERVER['REQUEST_METHOD']);

// GET パラメータから API 名とパラメータを取り出す
$params = array();

$query = $_GET;
$apiPath = $query['__path'];
$apiPathInfo = pathinfo($apiPath);

unset($query['__path']);
if ($method == 'post') {
    $query = $_POST;
}

// 受け取ったキーと値を $params に格納していく
foreach ($query as $key => $value) {
    if (in_array($key, $ignoreParams)) {
        unset($query[$key]);
    } else {
        $params[rawurlencode($key)] = rawurlencode($value);
    }
}

function toJsonString($str) {
    $before = array('/\\\\/',   '/\\r/', '/\\n/', '/\\t/', '/"/');
    $after = array( '\\\\\\\\', '\\\\r', '\\\\n', '\\\\t', '\\\\"');
    $str = preg_replace($before, $after, $str);
    return $str;
}


/* ======================================================
// ブリッジの場合
// ------------------------------------------------------ */

if($bridge || in_array($apiPath, $apiBridge)){
    // GET とポストで分ける
    $contents = '{}';
    $url = $apiBase . $apiPath;
    if($method == 'get'){
        $query = http_build_query($query);
        $options = array('http' => array(
            'method' => 'GET'
        ));
        $contents = file_get_contents($url.'?'.$query, false, stream_context_create($options));
    } else if ($method == 'post') {
        $options = array('http' => array(
            'method' => 'POST',
            'content' => http_build_query($query),
        ));
        $contents = file_get_contents($url, false, stream_context_create($options));
    }
    // 整形して出力
    header("Content-Type: application/json; charset=utf-8");
    print(json_encode(json_decode($contents), JSON_PRETTY_PRINT));
    exit;
}


/* ======================================================
// ローカル JSON を読む場合
// ------------------------------------------------------ */

// 探すファイルの配列
$searchFiles = array();

// 探すファイルの一覧をつくっていく
$keys = array_keys($params);
sort($keys);
$keysCount = count($keys);
$loopCount = pow(2, $keysCount);
for ($i = 0; $i < $loopCount; ++$i) {
    $keys2= array();
    for ($j = 0; $j < $keysCount; ++$j) {
        $pow = pow(2, $keysCount - 1 - $j);
        if (!($i & $pow)) {
            array_push($keys2, $keys[$j]);
        }
    }

    $keysCount2 = count($keys2);
    $loopCount2 = pow(2, $keysCount2);
    for ($j = 0; $j < $loopCount2; ++$j) {
        $fileName = '';
        $valueCount = 0;
        for ($k = 0; $k < $keysCount2; ++$k) {
            $pow = pow(2, $keysCount2 - 1 - $k);
            $fileName .= $fileName ? $paramSeparator : '';
            if ($j & $pow) {
                $fileName .= "{$keys2[$k]}";
            } else {
                $fileName .= "{$keys2[$k]}={$params[$keys2[$k]]}";
                ++$valueCount;
            }
        }

        array_push($searchFiles, array(
            'score1' => $keysCount2,
            'score2' => $valueCount,
            'score3' => 1,
            'score4' => $loopCount - $i,
            'fileName' => ($fileName ? $fileName : '__default') . ".$method.json"
        ));

        array_push($searchFiles, array(
            'score1' => $keysCount2,
            'score2' => $valueCount,
            'score3' => 0,
            'score4' => $loopCount - $i,
            'fileName' => ($fileName ? $fileName : '__default') . '.json'
        ));
    }

}
function comparator($a, $b) {
    if ($a['score1'] > $b['score1']) {
        return -1;
    } else if ($a['score1'] < $b['score1']) {
        return 1;
    }
    if ($a['score2'] > $b['score2']) {
        return -1;
    } else if ($a['score2'] < $b['score2']) {
        return 1;
    }
    if ($a['score3'] > $b['score3']) {
        return -1;
    } else if ($a['score3'] < $b['score3']) {
        return 1;
    }
    if ($a['score4'] > $b['score4']) {
        return -1;
    } else if ($a['score4'] < $b['score4']) {
        return 1;
    }
    return 0;
}
usort($searchFiles, 'comparator');

// ファイルを探して読み込む
$foundFile = '';
$dir = 'json/' . $apiPathInfo['basename'];
$searchFileNames = array();
foreach ($searchFiles as $searchFile) {
    array_push($searchFileNames, $searchFile['fileName']);
}
if (file_exists($dir)) {
    $dirFiles = scandir($dir);
    foreach ($searchFileNames as $file) {
        if (in_array($file, $dirFiles)) {
            $foundFile = $file;
            break;
        }
    }
}

$contents = '';
$jsonDir = json_encode($dir);
$jsonSearchFileNames = json_encode($searchFileNames);
$jsonFileName = json_encode($foundFile);
$jsonQuery = json_encode($query);
if ($foundFile) {
    $contents = file_get_contents($dir . '/' . $foundFile);
    // 末尾に探したファイル、読んでいるファイルなどの情報を付加する
    $contents = preg_replace('/\\}\\s*$/', <<<EOT
, "__api_dummy_info": {
    "dir": $jsonDir,
    "searched_path": $jsonSearchFileNames,
    "parameters":$jsonQuery,
    "file":$jsonFileName
}}
EOT
, $contents);
} else {
    // ファイルが見つからなかったらエラーを出す
    $contents = <<<EOT
{
    "error": "File not found.",
    "dir": $jsonDir,
    "searched_path": $jsonSearchFileNames,
    "parameters": $jsonQuery
}
EOT;
}

// <!--#include virtual=\"...\"--> で囲まれた部分をファイルを取ってきてむりやり置換する
if ($useSSI) {
    $pattern = '/<!--\\s*#include\\s+virtual=\\\\"(.+)\\\\"\\s*-->/';
    $i = 0;
    while (preg_match($pattern, $contents, $match)) {
        $escaped = toJsonString(file_get_contents($ssiRoot . $match[1]));
        $contents = str_replace($match[0], $escaped, $contents);
        $i ++;
        if ($i > 100) { echo 'break'; break; }
    }
}

// サーバーのレスポンス遅延をシミュレーションする
usleep(rand(300, 1000) * 1000);

// 整形して出力
header("Content-Type: application/json; charset=utf-8");
print(json_encode(json_decode($contents), JSON_PRETTY_PRINT));

exit;
