/* ======================================================
//
//   gid/all - 全画面共通の処理
//
// ====================================================== */

require([ 'Iroha', '$' ],
function(  Iroha,   $  ) {

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


		console.log('all');


	});

});
