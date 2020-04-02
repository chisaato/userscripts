// ==UserScript==
// @name         随行课堂 普通课程增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解除30分钟无操作返回
// @author       MisakaCloud
// @match        https://*.sflep.com/student/StudyCourse.aspx*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // 尝试去除检查是否活跃
    var cA = CheckActive
    window.CheckActive = function () {}
    // 清空30分钟计时器
    clearInterval(actTimerID);
    // 保持后台心跳正常运行
    var kLTACT = KeepLearnTimeAndCheckToken
    window.KeepLearnTimeAndCheckToken = function () {
        if (scoid == '')
            return;

        //sco学习时间
        var total_time = API_1484_11.GetValue('cmi.total_time');

        $.ajax({
            url: ajaxUrl,
            data: "action=keepsco_with_getticket_with_updatecmitime&uid=" + userid + "&cid=" + courseid + "&scoid=" + scoid + "&session_time=" + curSessionTime + "&total_time=" + total_time + "&&nocache=" + Math.random(),
            type: "POST",
            success: function (reData) {
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
            }
        });
    }
    document.oncontextmenu = true
    document.onselectstart = true
})();