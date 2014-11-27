/* ======================================================
//
//   necobase/ajax - 汎用 Ajax
//
// ====================================================== */

define([ '$', '_', 'necobase/necobase' ],
function( $,   _,   necobase           ) {


  /** @namespace */
  necobase.ajax = {};


  /**
   * 汎用 Ajax
   * @param {string} url         リクエストURL
   * @param {Object} settings    その他設定
   * @returns {$.Promise}
   */
  var ajax = function(url, settings) {
    var deferred = new $.Deferred();
    var ajaxSettings = {};

    _.extend(ajaxSettings, {
      method: 'get',
      data: {},
      cache: false,
      dataType: 'json',
      timeout: 60 * 1000,
      success: _(ajax.success).bind(null, ajaxSettings, deferred),
      error: _(ajax.fail).bind(null, ajaxSettings, deferred)
    }, settings);

    $.ajax(url, ajaxSettings);
    return deferred.promise();
  };

  ajax.success = function(settings, deferred, data, textStatus, jqXHR) {
    if (settings.dataType === 'json' && !data.result) {
      deferred.reject(jqXHR, 'error', 'Bad Request', data);
      return;
    }
    deferred.resolve(data, textStatus, jqXHR);
  };

  ajax.fail = function(settings, deferred, jqXHR, textStatus, errorThrown) {
    deferred.reject(jqXHR, textStatus, errorThrown, {});
  };


  return necobase.ajax = ajax;
});
