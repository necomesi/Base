/* ======================================================
 *
 *   NM/util - プロジェクトユーティリティ関数群
 *
 * ====================================================== */

define([ '_', '$', 'Iroha', 'NM'],
function (_,   $,   Iroha,   NM) {


/** @namespace */
NM.utils = {};


/**
 * クラス継承
 * @name NM.util.inherits
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
 * @name NM.util.getScreenId
 * @returns {string} 画面 ID
 */
function getScreenId() {
	return /^nm-sid-(.+)/.test(document.body.id) ? RegExp.$1 : '';
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

/**
 * クッキーを取得する
 * @name NM.util.getCookie
 * @param {string} [key]    クッキー名。指定しない場合すべてをオブジェクトで返却する
 * @returns {Object|string}
 */
function getCookie(key) {
	var result = key ? undefined : {};
	var cookies = document.cookie ? document.cookie.split('; ') : [];

	for (var i = 0, l = cookies.length; i < l; i++) {
		var parts = cookies[i].split('=');
		var name = decodeURIComponent(parts.shift());
		var cookie = parts.join('=');

		if (key && key !== name) continue;

		if (cookie.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			cookie = cookie.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		// Replace server-side written pluses with spaces.
		cookie = decodeURIComponent(cookie.replace(/\+/g, ' '));

		if (key && key === name) {
			result = cookie;
			break;
		} else {
			result[name] = cookie;
		}
	}

	return result;
}

/**
 * クッキーを設定する
 * @name NM.util.setCookie
 * @param {string} key
 * @param {string} value
 * @param {NM.util.CookieOption} [option]
 */
function setCookie(key, value, option) {
	if (value === undefined || _(value).isFunction()) return;
	option = option || {};

	var expires = new Date();
	if (option.expires) {
		expires.setTime(+expires + option.expires * 864e+5);
	}

	return (document.cookie = [
		encodeURIComponent(key), '=', encodeURIComponent(value),
		option.expires ? '; expires=' + expires.toUTCString() : '',
		option.path    ? '; path=' + option.path : '',
		option.domain  ? '; domain=' + option.domain : '',
		option.secure  ? '; secure' : ''
	].join(''));
}

/**
 * setCookie に使用されるオプション
 * @name NM.util.CookieOption
 * @param {Object} [opts]
 * @constructor
 */
function CookieOption(opts) {

	/** クッキーの有効期限。日数で指定する。0 の場合はセッション終了時に破棄される。
	 *  @type {number} */
	this.expires = 0;

	/** クッキーの有効範囲を示すパス。明記しなければ現在の文書のパスがデフォルトとなる。
	 *  @type {string} */
	this.path = '';

	/** クッキーの有効ドメインを示す。基本的には指定しないほうがよい。
	 *  @type {string} */
	this.domain = '';

	/** true にすると SSH 通信時のみクッキーが送られる。
	 *  @type {boolean} */
	this.secure = false;

	_(this).extend(opts);
}


return NM.utils = {
	  inherits    : inherits
	, getScreenId : getScreenId
	, ready       : ready
	, getCookie   : getCookie
	, setCookie   : setCookie
	, CookieOption: CookieOption
};
});
