let script = document.createElement("script");
script.setAttribute('src', '//code.jquery.com/jquery-latest.min.js');
script.addEventListener('load', function() {
    let script = document.createElement('script');
    document.body.appendChild(script);
}, false);
document.body.appendChild(script);
// 首先是修改今日积分
jQuery('.my-points-points').eq(1).text(25)
// 修改学习卡片-进度
jQuery('.my-points-card-progress-filled').css("width", "100%")
// 修改学习卡片-进度条文字
jQuery('.my-points-card-text').each(function(i, elem) {
    if (i == 0) {
        // 除了第一个,后面都是6分
        jQuery(this).text("1分/1分")
    } else {
        jQuery(this).text("6分/6分")
    }
})
// 丢该学习卡片-按钮
jQuery('.big').text('已完成')
jQuery('.big').attr("style", "")
jQuery('.big').css({
    color: "rgb(191, 191, 191)",
    background: "rgb(238, 238, 238)",
    cursor: "not-allowed"
})
