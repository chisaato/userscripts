// ==UserScript==
// @name         随行课堂 Unit Test 增强
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  在单元测试中提供增强
// @author       MisakaCloud
// @match        https://*.sflep.com/2019/test/test.aspx*
// @downloadURL  https://github.com/gzzchh/userscripts/raw/master/sflepUnitTestEnhance.user.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	// 解除听力次数限制
	// 显示播放器 一些杂项
	$("#divSound").removeAttr("style");
	var _PlaySound = PlaySound;
	window.PlaySound = function (src, id) {
		// var count = $('#hdPlay_' + id).val();
		var count = 999;
		// if (count <= 0)
		//     return;

		if (soundfile == "") {
			soundfile = resPath + "ItemRes/sound/" + src;
			createSoundPlayer();
		} else {
			soundfile = resPath + "ItemRes/sound/" + src;
			jwplayer("soundplayer").load([
				{
					file: soundfile,
				},
			]);
		}
		jwplayer("soundplayer").onPlaylistComplete(function () {
			jwplayer("soundplayer").load([
				{
					file: "",
				},
			]);
		});
		jwplayer("soundplayer").onBufferFull(function () {
			clearTimeout(bufferingTimer);

			var sp = $("#btnPlay_" + id);
			if (sp.length > 0) {
				// var count = $('#hdPlay_' + id).val();
				var count = 999;
				if (count > 0)
					// count--;

					//sp.val('播放（' + count + '次机会）');
					sp.html(
						'<span class=" fa fa-play-circle play_symble">' +
							count +
							"次播放机会</span>"
					);

				$("#hdPlay_" + id).val(count);
				if (count == 0) {
					//$('#btnPlay_' + id).attr("disabled", "disabled");
					$("#btnPlay_" + id).attr("href", "javascript:void(0);");
				}
			}

			sp.removeClass("loading");
		});

		$("#btnPlay_" + id).val("正在加载");
		bufferingTimer = setTimeout("PlayerExpireCheck('" + id + "', 0)", 1000);
		$("#btnPlay_" + id).addClass("loading");
		$("#soundplayer").css("");
		jwplayer("soundplayer").play();
		// 移动到附近
		//offset()获取当前元素基于浏览的位置
		var offsettop = $("#btnPlay_" + id).offset().top;
		var offsetleft = $("#btnPlay_" + id).offset().left;
		//position()获取当前元素基于父容器的位置
		var positiontop = $("#btnPlay_" + id).position().top;
		var positionleft = $("#btnPlay_" + id).position().left;
		//设置panel的位置基于unamespan的坐标
		$("#soundplayer").css({
			position: "absolute",
			top: offsettop - 20,
			left: offsetleft + 150,
			"z-index": 2,
		});
		// 切换成无视频显示,并且拉长
		$("#soundplayer").css("width", "350px").css("height", "0px");
	};

	// 停止计时器
	var _StartTimer = StartTimer;
	window.StartTimer = function () {};
	clearInterval(timer);

	// 尝试显示进度条和控制
	var cSP = createSoundPlayer;
	window.createSoundPlayer = function () {
		jwplayer("soundplayer").setup({
			flashplayer: "script/jwplayer.flash.swf?c=" + Math.random(),
			file: soundfile,
			// height: 140,
			// width: 140,
			// skin: "six",
			primary: "html5",
			"controlbar.position": "bottom",
			"controlbar.idlehide": "false",
			controlbar: "bottom",
		});
	};
	// 尝试提交时锁定已用时间
	var SCP = SaveCurrentPart;
	window.SaveCurrentPart = function (isTotalSubmit) {
		if (submited) return;

		//整理答题情况
		var answerXml = GenerateAnswerXML();

		//ajax 保存part答题情况
		$.ajax({
			url: "Test.aspx",
			data: {
				action: "savePart",
				answer: escape(answerXml),
				partnum: curPartNum,
				account: "4351182",
				useSeconds: 0,
				sttid: sttid,
				ttid: 210729,
				sheetid: 13466,
				issubmit: isTotalSubmit,
				nocache: Math.random(),
			},
			type: "POST",
			async: false,
			success: function (ret) {
				sttid = ret;
				if (isTotalSubmit) {
					submited = true;
					Return("");
				}
			},
		});
	};
	// 其他杂项
	// 解除禁止选择禁止复制
	document.oncontextmenu = true;
	document.onselectstart = true;
	// 不要翻译选项
	$(".form-inline").find("option").addClass("notranslate");
})();
