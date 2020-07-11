// ==UserScript==
// @name         随行课堂 期末考试 增强
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  在期末考试中提供增强
// @author       MisakaCloud
// @match        https://course.sflep.com/2019*
// @downloadURL  https://github.com/gzzchh/userscripts/raw/master/sflepUnitTestEnhance.user.js
// @grant        none
// ==/UserScript==

// 解除听力次数限制
// 显示播放器 一些杂项
$("#divSound").removeAttr("style");
var _PlaySound = PlaySound;
window.PlaySound = function (src, id) {
	// var count = $("#hdPlay_" + id).val();
	var count = 999;

	if (soundfile == "") {
		soundfile = resPath + "ItemRes/sound/" + src;
		createSoundPlayer();
	} else {
		soundfile = resPath + "ItemRes/sound/" + src;
		jwplayer("soundplayer").load([{ file: soundfile }]);
	}
	jwplayer("soundplayer").onPlaylistComplete(function () {
		jwplayer("soundplayer").load([{ file: "" }]);
	});
	jwplayer("soundplayer").onBufferFull(function () {
		clearTimeout(bufferingTimer);

		var sp = $("#btnPlay_" + id);
		if (sp.length > 0) {
			// var count = $("#hdPlay_" + id).val();
			// if (count > 0) count--;
			var count = 999;
			if (count > 0)
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

			// SaveCurrentPart(false, true); //异步保存，实时更新听力次数
		}

		sp.removeClass("loading");
	});

	$("#btnPlay_" + id).val("正在加载");
	bufferingTimer = setTimeout("PlayerExpireCheck('" + id + "', 0)", 1000);
	$("#btnPlay_" + id).addClass("loading");

	jwplayer("soundplayer").play();
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
window.SaveCurrentPart = function (isTotalSubmit, isAsync) {
	if (isAsync == undefined || isAsync == null) isAsync = false;

	if (submited) return;

	//整理答题情况
	var answerXml = GenerateAnswerXML();

	//总用时（=本次剩余时间-当前剩余时间+上次用时）
	var useSeconds =
		parseInt($("#ctl00_baseMaterContent_hdSeconds").val()) -
		seconds +
		parseInt($("#ctl00_baseMaterContent_hdSecondsUsed").val());

	//ajax 保存part答题情况
	$.ajax({
		url: "SchoolTest.aspx",
		data: {
			action: "savePart",
			answer: escape(answerXml),
			partnum: curPartNum,
			account: "4351182",
			useSeconds: useSeconds,
			sstid: sstid,
			sheetid: 27904,
			issubmit: isTotalSubmit,
			nocache: Math.random(),
		},
		type: "POST",
		async: isAsync,
		success: function (ret) {
			sstid = ret;
			if (sstid == -100) alert("提交失败，测试次数已达到上限");
			if (isTotalSubmit) {
				submited = true;
				Return("");
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			if (textStatus == "timeout") {
				//网络超时
				alert("网络超时");
			} else if (textStatus == "error" && jqXHR.readyState == 0) {
				//网络断开
				alert("网络断开，请重连网络后再继续考试！");
				setTimeout(
					"SaveCurrentPart(" + isTotalSubmit + "," + isAsync + ")",
					1000
				); //再次检测-提交
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
