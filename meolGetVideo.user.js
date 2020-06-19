function getUrl(url) {
	var data = null;

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === this.DONE) {
			// console.log(this.responseText);
			console.log("success");
		}
	});

	xhr.open("GET", url);

	xhr.send(data);
}
$(".table-margin-alternation-td").each(function () {
	var videoUrl = $(this).find("a").eq(1).attr("href");
	getUrl(videoUrl);
});
