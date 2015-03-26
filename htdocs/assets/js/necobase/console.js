/* ======================================================
//
//   Console fallback
//     IE9 以前のブラウザでは開発者ツールを開かない限り Console API が存在しない。
//     そのためダミーの関数を window.console 以下に作らなければならない。
//
// ====================================================== */

!function() {


  window.console = window.console || {};

  ('assert,clear,count,debug,dir,dirxml,error,group,groupCollapsed,groupEnd,' +
  'info,log,profile,profileEnd,time,timeEnd,timeStamp,trace,warn')
    .split(',').forEach(function(key) {
      if (!console[key]) console[key] = function() {};
    });


}();
