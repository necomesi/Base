/* ======================================================
 *
 *   necobase/cookie - Cookie を中央管理する
 *
 * ====================================================== */

define([ '_', '$', 'necobase', 'necobase/util'],
function (_,   $,   necobase,   util) {


var defaultSetting = new util.CookieOption({
	expires: 90,
	path   : '/'
});

var namespace = 'necobase-';
var cookie = necobase.cookie = {};

/**
 * CookieのGetter/Setterを定義する。
 * @param {string} name    Getter/Setter の名前。ここで指定した名前に 'get', 'set' の接頭辞が付加されるかたちで Getter/Setter が定義される。
 * @param {string} type    Cookieのデータ型。 'boolean', 'number', 'string', 'object', 'array', 'date' のいずれか。
 * @param {Object} [settings] 設定オブジェクト。省略でデフォルト値。
 */
function register(name, type, settings) {
	cookie['set' + name] = function (value) {
		switch (type) {
		case 'object':
		case 'array':
			$.cookie(namespace + name, JSON.stringify(value), _(settings || {}).defaults(defaultSetting));
			break;
		case 'date':
			$.cookie(namespace + name, value.getTime(), _(settings || {}).defaults(defaultSetting));
			break;
		default:
			$.cookie(namespace + name, "" + value, _(settings || {}).defaults(defaultSetting));
		}
	};

	cookie['get' + name] = function () {
		var value = $.cookie(namespace + name);
		switch (type) {
		case 'boolean':
			return value === 'true';
		case 'number':
			return parseInt(value, 10);
		case 'object':
		case 'array':
			return JSON.parse(value);
		case 'date':
			return new Date(+value);
		default:
			return value;
		}
	};
}


/* ======================================================
 * クッキーの読み書きを定義
 * ------------------------------------------------------ */

/**
 * @function necobase.cookie.setTestCookie
 * @param {Object} obj    Object to save
 */
/**
 * @function necobase.cookie.getTestCookie
 * @returns {Object} Saved object
 */
register('TestCookie', 'object', { expires: null });


return cookie;
});
