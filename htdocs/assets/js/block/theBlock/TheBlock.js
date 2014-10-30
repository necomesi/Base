/* ======================================================
 *
 *   TheBlock - クラスの説明
 *   - やっていること 1
 *   - やっていること 2
 *   - やっていること 3
 *
 * ====================================================== */

define([ '_', 'Backbone', '$'],
function (_,   Backbone,   $) {


var BASE_CLASS = 'necobase-theBlock';


var TheBlock = Backbone.View.extend(
/** @lends TheBlock# */
{
	setting: {
	},

	/**
	 * クラスの説明
	 * @constructs
	 * @extends Backbone.View
	 */
	initialize: function (setting) {
		this.setting = _(setting).defaults(this.setting);
		this.$el.data(BASE_CLASS, this);
	}
},
/** @lends TheBlock */
{
}
);


return TheBlock;
});
