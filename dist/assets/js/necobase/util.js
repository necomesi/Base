/* ======================================================
//
//   necobase/util - プロジェクトユーティリティ関数群
//
// ====================================================== */

!function() {


  /**
   * クラス継承
   * @name necobase.util.inherits
   * @param {Function} Constructor
   * @param {Function} SuperConstructor
   * @returns {Function}
   */
  function inherits(Constructor, SuperConstructor) {
    function F() {}
    F.prototype = SuperConstructor.prototype;
    Constructor.prototype = new F();
    Constructor.prototype.constructor = Constructor;
    return Constructor;
  }

  /**
   * 現在のページの画面 ID を取得する
   * @name necobase.util.getGID
   * @returns {string} 画面 ID
   */
  function getGID() {
    return getGID.GID || (getGID.GID = /^necobase-gid--(.+)/.test(document.body.id) ? RegExp.$1 : '');
  }

  /**
   * DOMReady の Deferred を返す
   * @returns {jQuery.Promise}
   */
  function ready() {
    var deferred = new $.Deferred;
    $(document).ready(deferred.resolve);
    return deferred.promise();
  }


  /** @namespace */
  necobase.utils = {
    inherits: inherits,
    getGID  : getGID,
    ready   : ready
  };


}();
