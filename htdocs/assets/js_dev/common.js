/* ======================================================
 *
 *   main - すべてのページから読み込まれる JS ファイル
 *   - RequireJS の設定
 *   - 画面固有 JS の読み込み
 *   - 全ページ共通の処理
 *
 * ====================================================== */


/* ======================================================
 * RequireJS の設定
 * ------------------------------------------------------ */

require.config({
	baseUrl: '/assets/js',
	shim: {
		'$': {
			exports: 'jQuery'
		},
		'_': {
			exports: '_'
		},
		'Backbone': {
			deps: ['_', '$'],
			exports: 'Backbone'
		},
		'Iroha': {
			deps: ['$'],
			exports: 'Iroha'
		}
	},
	paths: {
		// JS ライブラリ
		  'text'              : 'lib/text'
		, '_'                 : 'lib/underscore'
		, 'Backbone'          : 'lib/backbone'
		, 'jquery'            : 'lib/jquery-2.1.0.js'
		, '$'                 : 'lib/jquery-2.1.0.js'
		, 'Iroha'             : 'lib/iroha'

		// ブロックの JS は使用頻度が多い割に階層が深いのでここでまとめて登録する。
		// アルファベット順に並べるといいかも。
		, TheBlock: 'block/theBlock/TheBlock'
	}
});


/* ======================================================
 * 画面固有 JS の読み込み
 * ------------------------------------------------------ */

require(['pageSpecific/pageSpecific']);


/* ======================================================
 * 全ページ共通の処理
 * ------------------------------------------------------ */

require(['Iroha', '$'],
function (Iroha,   $) {

$(function () {


	var $document = $(document);


	// iOS の場合、$(document).on('click') が自由に扱えない。
	// そのためダミーのクリックイベントを body の直接の子要素にバインドする。
	// こうすることで $(document) が click イベントを受け取れるようになる。
	if (Iroha.ua.isiOS) {
		$(document.body).children().on('click', function () {});
	}


	// Weinre
//	Iroha.injectWeinre();


});


});
