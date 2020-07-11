// ==UserScript==
// @name         万学-就/创业指导
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  配合ElasticSearch自动答题? 骚不骚?
// @author       gzzchh
// @require        file://E:\SourceCode\wxJob\wxJob.user.js
// @match        https://jluzh.wanxue.cn/sls/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        unsafeWindow
// ==/UserScript==
(function () {
	"use strict";

	/**
	 * 将中文符号转换成英文符号
	 */
	function cn2en(chineseChar) {
		// 将单引号‘’都转换成'，将双引号“”都转换成"
		var str = chineseChar.replace(/\’|\‘/g, "'");
		// 针对引号有单独的方式
		str = str.replace(/\“/g, "“").replace(/\”/g, "”");
		// 将中括号【】转换成[]，将大括号｛｝转换成{}
		str = str
			.replace(/\【/g, "[")
			.replace(/\】/g, "]")
			.replace(/\｛/g, "{")
			.replace(/\｝/g, "}");
		// 处理中文的括号
		str = str.replace(/\（/g, "(").replace(/\）/g, ")");
		// 将逗号，转换成,，将：转换成: 还有分号,句号的转换
		str = str
			.replace(/\，/g, ",")
			.replace(/\：/g, ":")
			.replace(/\；/g, ";")
			.replace(/\。/g, ".");
		return str;
	}

	function getQuestion(question) {
		var typeStr = question.find(".tc").eq(0).text();
		// 先找tr 第一个
		// 再找td 第三个
		// 最后找p 第一个
		var titleStr = question
			.find("tr")
			.eq(0)
			.children("td")
			.eq(2)
			.find("p")
			.eq(0)
			.text();
		// 去掉冒号
		titleStr = titleStr.substring(0, titleStr.length - 1);
		// 判断单选多选,就用最简单的好了
		var questionType;
		if (typeStr == "（单选）") {
			questionType = "singleSelection";
		} else if (typeStr == "（多选）") {
			questionType = "multipleSelection";
		}
		var result = {
			type: questionType,
			title: titleStr,
		};
		return result;
		// console.log(JSON.stringify(result))
	}

	function setAnswer(question, answer) {
		/**
		 * 一种方法, 先寻找class = option, 再扫描input
		 * 不对 input不会显示,应该先扫描label,再去点那些input
		 */
		question
			.find(".option")
			.find("label")
			.each(function () {
				// 扫描label是正确的
				var chooseStr = $(this).text();
				/**
				 * 尝试定位input呢
				 * 不要定位input, 他是内联HTML 直接调用子对象去点击就可以了.
				 */
				var option = $(this).children();
				// console.log(answer)
				// 简单过滤一下
				if (answer.includes(chooseStr)) {
					console.log("根据答案 " + answer + " 选中 " + chooseStr);
					option.click();
				}
			});
	}
	// 直接链接ES查询
	function searchAnswer(question, title) {
		var title = title["title"] + "*";
		title = cn2en(title).replace(/\s+/g, "");
		console.log(title);
		GM_xmlhttpRequest({
			method: "GET",
			url: "https://emmm.pterodactyl.org.cn/Server.php?q=" + title,
			onload: function (response) {
				if (response.readyState === response.DONE) {
					// console.log(response.responseText);
					var responseJson = JSON.parse(response.responseText);
					var answerArr = responseJson.hits.hits[0]._source.answer;
					// 此处无法使用return 所以直接现场处理掉
					setAnswer(question, answerArr);
				}
			},
		});
	}

	function randomNum(minNum, maxNum) {
		switch (arguments.length) {
			case 1:
				return parseInt(Math.random() * minNum + 1, 10);
				break;
			case 2:
				return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
				break;
			default:
				return 0;
				break;
		}
	}

	function delayExecute(func) {
		var randomSecond = randomNum(3, 10);
		console.log("延迟" + randomSecond + "秒,执行" + func);
		setTimeout(function () {
			eval(func);
		}, randomSecond * 1000);
	}
	// 判断是不是答题页面
	if (!($(".question").html() == null)) {
		// 先来清除一下默认计时器
		// cleartime()
		// 再干掉开始计时
		var setTimer = setint;
		window.setint = function () {
			cleartime();
			timenumber = 0;
			var ssnumber = sgom(timenumber);
			$("#stemTime").html(ssnumber);
			timenumber = 0;
		};

		// 扫描并答题
		$(".question").each(function () {
			var questionTitle = getQuestion($(this));
			console.log(questionTitle["title"]);
			searchAnswer($(this), questionTitle);
		});
		// 答题结束 提交
		delayExecute("$('#submietStemDisable').click()");
	}

	// 页面判断
	// 首先采集变量
	var hasRest = !($(".but1.monkeybeginnextstudy").html() == null);
	var hasNextButton = !($(".btn-next-bg").html() == null);
	var hasVideo = !($(".ccH5Poster").html() == null);
	var hasReturnToMenu = !($(".tdent").html() == null);
	var hasChapterMenu = !($(".letters.clearfix").html() == null);
	// 做判断
	var isEndOfTest = hasRest & hasNextButton & !hasVideo;
	var isTextBook = !hasRest & hasNextButton & !hasVideo;
	var isVideo = hasRest & hasNextButton & hasVideo;
	var isEndOfChapter = hasReturnToMenu;
	var isChapterMenu = hasChapterMenu;
	if (isEndOfTest) {
		console.log("这是答题结束的页面");
		delayExecute("$('.btn-next-bg').click()");
		delayExecute("$('.but1.monkeybeginnextstudy').click()");
	}
	// 判断是不是视频和讲义
	if (isTextBook) {
		console.log("这是讲义界面");
		delayExecute("$('.btn-next-bg').click()");
	}
	if (isVideo) {
		console.log("这是视频界面");
		delayExecute("$('.btn-next-bg').click()");
	}
	if (isEndOfChapter) {
		console.log("章节结束");
		var jumpLocation = $(".button1").find("a").attr("href");
		window.location.href = jumpLocation;
	}
	if (isChapterMenu) {
		console.log("这是章节选择菜单页面");
		// 找到还没有答的
		$(".letters.clearfix")
			.children("li")
			.each(function () {
				var chapterProgress = $(this).find("canvas").attr("value");
				if (chapterProgress < 100) {
					$(this).click();
					return false;
				}
				console.log("章节进度: " + chapterProgress);
			});
		console.log("");
		delayExecute(" $('.super-study-wrap').find('a').click()");
	}
})();
