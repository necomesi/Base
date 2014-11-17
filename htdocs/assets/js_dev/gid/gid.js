/* ======================================================
//
//   gid/gid
//   - 画面固有の処理が記述される JS ファイルを require する
//
// ====================================================== */

require(['_', 'necobase/util', 'text!gid/gid.json'],
function (_,   util,            map) {


var specifics = JSON.parse(map);
var path = '/assets/js/gid';

var myGID = util.getGID();
if (myGID) {
	_(specifics).each(function (val, key) {
		_(val).each(function (sid) {
			if (sid === myGID) {
				require([path + '/' + key + '.js']);
			}
		});
	});
}


});
