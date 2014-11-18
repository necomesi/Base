/* ======================================================
//
//   main - すべてのページから読み込まれる JS ファイル
//   - RequireJS の設定
//   - 画面固有 JS の読み込み
//   - 全ページ共通の処理
//
// ====================================================== */


/* ======================================================
// RequireJS の設定
// ------------------------------------------------------ */

require.config({
	//urlArgs: '2014011701',
	baseUrl: '/assets/js',
	shim: {
		'modernizr': {
			exports: 'Modernizr'
		},
		'$': {
			exports: 'jQuery'
		},
		'_': {
			exports: '_'
		},
		'Iroha': {
			deps: ['$'],
			exports: 'Iroha'
		}
	},
	paths: {
		// JS ライブラリ
		'text'     : '../vendor/requirejs-text/text',
		'Modernizr': '../vendor/modernizr/modernizr',
		'_'        : '../vendor/underscore/underscore',
		'jquery'   : '../vendor/jquery/dist/jquery',
		'$'        : '../vendor/jquery/dist/jquery',
		'Iroha'    : 'iroha/iroha',

		// ブロックの JS は使用頻度が多い割に階層が深いのでここでまとめて登録する。
		// アルファベット順に並べるといいかも。
		TheBlock: 'block/theBlock/TheBlock'
	}
});


/* ======================================================
// 必須ライブラリと全画面共通の初期処理を開始する JS の読み込み
// ------------------------------------------------------ */

require(['Modernizr', '$', '_', 'Iroha', 'necobase', 'gid/gid', 'gid/all']);
