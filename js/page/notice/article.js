mui.init({
		swipeBack:true //启用右滑关闭功能
	});
	
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		var obj = {id:self.nid};
		app.ajax("lf_news/view",obj, function(param) {
			document.querySelector('.tle').innerHTML = param.title;
			document.querySelector('.article-time').innerHTML = param.add_time;
			document.querySelector(".article-content").innerHTML = param.content;
		});
	});