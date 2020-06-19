// ==UserScript==
// @name         随行课堂 普通课程增强
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  在普通课堂作业中提供一些增强功能
// @author       MisakaCloud
// @match        https://*.sflep.com/student/StudyCourse.aspx*
// @downloadURL  https://github.com/gzzchh/userscripts/raw/master/sflepNormalCourseEnhance.user.js
// @grant        none
// ==/UserScript==

(function () {
	"use strict";
	// 尝试去除检查是否活跃
	var cA = CheckActive;
	window.CheckActive = function () {};
	// 清空30分钟计时器
	clearInterval(actTimerID);
	// 保持后台心跳正常运行
	var kLTACT = KeepLearnTimeAndCheckToken;
	window.KeepLearnTimeAndCheckToken = function () {
		if (scoid == "") return;

		//sco学习时间
		var total_time = API_1484_11.GetValue("cmi.total_time");
		// var total_time = 21600;

		$.ajax({
			url: ajaxUrl,
			data:
				"action=keepsco_with_getticket_with_updatecmitime&uid=" +
				userid +
				"&cid=" +
				courseid +
				"&scoid=" +
				scoid +
				"&session_time=" +
				// curSessionTime +
				21605 +
				"&total_time=" +
				total_time +
				"&&nocache=" +
				Math.random(),
			type: "POST",
			success: function (reData) {
				reData.ret = 0;
				reData.seconds = 21683;
				if (reData.ret == 0 || reData.ret == 1) {
					//CheckToken
					// if (decodeURIComponent(reData.ticket) != studyTicket) {
					//     hasLeft = true;
					//     EndSCO(true);
					//     alert('检测到正在学习另一课件，将返回课程主页');
					//     ReturnMain();
					// }

					//保持计时 keep alive
					if (reData.ret == 0) {
						isTimeout = false;
						//更新客户端sco学习时间
						UpdateTotalTime_Client(parseInt(reData.seconds));
					}
					//重新开始计时
					else if (reData.ret == 1) {
						isTimeout = false;
					}
				}
			},
			error: function (request, status, err) {
				if (status == "timeout") {
					isTimeout = true;
				}
			},
		});
	};
	var eSco = EndSCO;
	var isEndCommit = true;
	window.EndSCO = function EndSCO(endSession) {
		// if (API_1484_11.comState != "Running") return false;

		var info = "";
		var seconds = 21600 + Math.random();
		var progress = 1;
		var crate = "";
		var status = "passed";
		var cstatus = "completed";
		var trycount = 0;

		try {
			// progress = API_1484_11.GetValue("cmi.progress_measure");
			// crate = API_1484_11.GetValue("cmi.score.scaled");
			// status = API_1484_11.GetValue("cmi.success_status");
			// cstatus = API_1484_11.GetValue("cmi.completion_status");
			// trycount = API_1484_11.GetValue("cci.retry_count");
			if (
				cstatus == "completed" &&
				!$("#liSCO_" + scoid).hasClass("course_disable")
			) {
				MarkFinishStyle();
				UpdateUnitFinishPercent();
			}
		} catch (ex) {}

		clearInterval(keeplearntimeid);

		$.ajax({
			async: false,
			url: ajaxUrl,
			data:
				"action=savescoinfo160928&cid=" +
				courseid +
				"&scoid=" +
				scoid +
				"&uid=" +
				userid +
				"&progress=" +
				progress +
				"&crate=" +
				crate +
				"&status=" +
				status +
				"&cstatus=" +
				cstatus +
				"&trycount=" +
				trycount +
				"&nocache=" +
				Math.random(),
			type: "POST",
			success: function (reData) {
				reData.ret = 0;
				reData.seconds = 21675;
				if (reData.ret == 0) {
					info = "true";

					if (reData.isAutoCommit == "true") {
						//更新学习时间
						UpdateTotalTime_Client(parseInt(reData.seconds));

						isEndCommit = true;
						API_1484_11.Commit("");
					} else {
						//更新学习时间
						UpdateTotalTime(parseInt(reData.seconds));
						isEndCommit = true;
						API_1484_11.Commit("");
					}
				}
			},
			error: function (request, status, err) {
				if (status == "timeout") {
					isTimeout = true;
				}
			},
		});
		/*
            if (endSession) {
                $.ajax({
                    url: ajaxUrl,
                    data: "action=monitorendstudy&uid=" + userid + "&cid=" + courseid + "&nocache=" + Math.random(),
                    type: "POST",
                    success: function (reData) {
                    }
                });
            }*/

		if (info == "true") return true;
		else return false;
	};
	document.oncontextmenu = true;
	document.onselectstart = true;
})();
