mui.init({
	swipeBack:true //启用右滑关闭功能
});

mui.plusReady(function() {
	document.addEventListener('money-addEvent', function(event) {
		init();
	});
	init();
});

function init(){
	var hi = document.documentElement.clientHeight || document.body.clientHeight;
	var wh = document.documentElement.clientWidth || document.body.clientWidth;
	wh = wh/2;
	
	document.querySelector(".share-return").addEventListener("click",function(){
		mui.back();
	});
	
	$(".mui-content").height(hi+"px");
	var state = app.getState(); //获取登陆信息
	var obj = {id:state.user.id};
	app.ajax("lf_person/shares",obj, function(param) {
		content = param;
		$('#qrcode').qrcode({width:wh,height:wh,correctLevel:0,text:content}); 
	});
}