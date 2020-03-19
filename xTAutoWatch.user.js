// ==UserScript==
// @name         学堂在线 自动播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://next.xuetangx.com/learn/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function covertTimeToSeconds(time) {
        var a = time.split(':'); // split it at the colons

        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        return seconds
    }

    function checkVideo() {
        if (jQuery('.white').text() == "") {
            console.log("没有检测到时间,可能不是视频?")
            return false
        } else {
            return true
        }
    }

    function checkEnd() {
        // https://next.xuetangx.com/learn/jluzh61021002425/jluzh61021002425/1520618/quiz/1486062
        var curURL = document.location.toString();
        if (curURL.indexOf("quiz/1486062") != -1) {
            return true
        } else {
            return false
        }
    }

    function getWatchPercent() {
        var curWatchTime = jQuery('.white').text()
        var totaWatchlTime = jQuery('.white').next().text()
        var curWatchTimeSeconds = covertTimeToSeconds(curWatchTime)
        var totaWatchlTimeSeconds = covertTimeToSeconds(totaWatchlTime)
        // console.log(curWatchTimeSeconds)
        // console.log(totaWatchlTimeSeconds)
        var watchPercent = curWatchTimeSeconds / totaWatchlTimeSeconds
        // console.log(watchPercent)
        return watchPercent
    }
    var interval = setInterval(function () {
        if (checkVideo()) {
            if (getWatchPercent() == 1) {
                console.log("已看完")
                jQuery('.next').click()
                return
            } else {
                console.log("还没有看完,当前进度: " + getWatchPercent())
            }
        } else {
            if (checkEnd()) {
                console.log("已经是最后一章,结束执行")
                clearInterval(interval);
            } else {
                console.log("直接跳转")
                jQuery('.next').click()
            }
        }
    }, 5 * 1000)


})();