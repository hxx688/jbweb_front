mui.init({
	swipeBack:true //启用右滑关闭功能
});

mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	var obj = {id:self.nid};
	app.ajax("lf_help/view",obj, function(param) {
		document.querySelector('.tle').innerHTML = param.f_vc_bt;
		document.querySelector('.article-time').innerHTML = param.f_dt_fbsj;
		document.querySelector(".article-content").innerHTML = param.f_tx_nr;
	});
});