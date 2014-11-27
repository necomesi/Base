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


    /* ======================================================
    // グリッドユニットの間にあるホワイトスペースを除去
    // ------------------------------------------------------ */

    $(function() {
      var count = 0;
      $('.necobase-ss-grid').each(function() {
        var i = this.childNodes.length - 1;
        var child;
        for (; i >= 0; --i) {
          child = this.childNodes[i];
          if (child.nodeType === Node.TEXT_NODE) {
            this.removeChild(child);
            ++count;
          }
        }
      });
      if (count) {
        console.warn('グリッドユニットの間にテキストノードがあります。(' + count + '箇所)');
      }
    });


    // Weinre
//  Iroha.injectWeinre();


    console.log('all');


  });
});
