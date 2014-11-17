/* ======================================================
 *
 *   pageSpecific/pageSpecific
 *   - 画面固有の処理が記述される JS ファイルを require する
 *
 * ====================================================== */

require(['_', 'text!pageSpecific/pageSpecificMap.json'],
function (_,   map) {


var specifics = JSON.parse(map);
var path = '/assets/js/pageSpecific';

var myScreenId = getScreenId();
if (myScreenId) {
	_(specifics).each(function (val, key) {
		_(val).each(function (sid) {
			if (sid === myScreenId) {
				require([path + '/' + key + '.js']);
			}
		});
	});
}

function getScreenId() {
	return /^necobase-sid-(.+)/.test(document.body.id) ? RegExp.$1 : '';
}


});
