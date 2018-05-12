mui.plusReady(function() {
	document.addEventListener('myEvent', function(event) {
		init();
	});
	init();
});

function init(){
	var state = app.getState(); //获取登陆信息
	if(!state.user){
		exitApp();
		return;
	}
	var obj = {id:state.user.id};
	app.ajax("lf_person/info",obj, function(param) {
		document.querySelector(".index-my-money-number").textContent = param.amount;
	});
	
	mui(".index-my-money-button").on('tap', '.in-money', function(e) {
		var is_agent = state.user.is_agent;
		if(is_agent=='1'){
			mui.toast("代理商不能充值");
		}else{
			mui.openWindow('page/my/money-add.html');
		}
	});
	
	mui(".index-my-money-button").on('tap', '.out-money', function(e) {
		mui.openWindow('page/withdraw/Withdrawals.html');
	});
	
	mui(".clause").on('tap', 'a', function(e) {
		var nid = "252";
	  	mui.openWindow({url:'page/help/helpDetail.html',extras: {nid: nid}});
	});
	mui(".Withdrawals").on('tap', 'a', function(e) {
	  	mui.openWindow('page/withdraw/Withdrawals-list.html');
	});
	mui(".myrecord").on('tap', 'a', function(e) {
	  	mui.openWindow('page/my/money-list.html');
	});
	mui(".password").on('tap', 'a', function(e) {
	  	mui.openWindow('page/my/Password-change.html');
	});
	mui(".transaction").on('tap', 'a', function(e) {
	  	mui.openWindow('page/trade/trade-history.html');
	});
	mui(".shares").on('tap', 'a', function(e) {
	  	mui.openWindow('page/my/shares.html');
	});
}