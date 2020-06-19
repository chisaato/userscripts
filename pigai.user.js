(function () {
	"use strict";
	var old_init_no_paste = init_no_paste;
	window.init_no_paste = function init_no_paste() {
		$(".no_paste").bind("contextmenu", function () {
			return false;
		});
		$(".no_paste").bind("selectstart", function () {
			return false;
		});
		$(".no_paste *").bind("selectstart", function () {
			return false;
		});
		//$('.no_paste').keydown(function(e){ if (  e.ctrlKey ){  return false;}});;
		if (_no_paste != "1") return;
		var cobj = $("#contents");
		if (arguments.length > 0) cobj = arguments[0];
		cobj.bind("contextmenu", function () {
			return false;
		});
		// cobj.keydown(function (e) {
		// 	if (e.keyCode == 86 && e.ctrlKey) {
		// 		alert("您的老师启用了“禁止粘贴”选项 ");
		// 		return false;
		// 	}
		// });
		// cobj.bind("dragenter", function (e) {
		// 	$(this).attr("disabled", true);
		// 	F.show(
		// 		"请勿拖拽",
		// 		"<div style='padding:10px 0 20px 0;'>老师启用了“禁止粘贴”选项 请勿拖拽</div>",
		// 		[
		// 			[
		// 				function () {
		// 					cobj.attr("disabled", false);
		// 					F.hide(1);
		// 				},
		// 				" 回到写作 ",
		// 			],
		// 		],
		// 		400,
		// 		0
		// 	);

		// 	return false;
		// });
	};
})();
