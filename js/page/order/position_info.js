mui.init({
	beforeback: function() {
		var wobj = plus.webview.getWebviewById("lf_mystock.html");
    	mui.fire(wobj,'mystockEvent');
		localStorage.setItem("isTime","4");
		return true;
	}
});

(function($, doc) {
	$.init();
	$.ready(function() {
		//止盈选择弹出框
		var userPicker = new $.PopPicker();
		var listData=[];
		for(var i=30,j=0;i<95;j++){
			listData[j]=i+"%";
			i=i+5;
		}
		userPicker.setData(listData);
		var showUserPickerButton = doc.getElementById('showUserPicker');
		var userResult = doc.getElementById('userResult');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				userResult.innerText = items[0];
				var earn = userResult.innerText.replace("%","");				
				var obj = {id:order_id,type:'1',earn:earn};
				app.ajax("lf_order/set",obj, function(param) {
					mui.toast("设置成功");
				})
			});
		}, false);
		//-----------------------------------------
		//止损选择弹出框
		var userPicker_2 = new $.PopPicker();
		var listData_2=[];
		for(var i=20,j=0;i<95;j++){
			listData_2[j]=i+"%";
			i=i+5;
		}
		userPicker_2.setData(listData_2);
		var showUserPickerButton_2 = doc.getElementById('showUserPicker2');
		var userResult_2 = doc.getElementById('userResult2');
		showUserPickerButton_2.addEventListener('tap', function(event) {
			userPicker_2.show(function(items) {
				userResult_2.innerText = items[0];
				var earn = userResult_2.innerText.replace("%","");				
				var obj = {id:order_id,type:'2',earn:earn};
				app.ajax("lf_order/set",obj, function(param) {
					mui.toast("设置成功");
				})
			});
		}, false);
		//-----------------------------------------
					});
})(mui, document);

var order_id;
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	order_id = self.order_id;
	localStorage.setItem("isTime","5");
	firstInit();		
});

function firstInit(){
	var obj = {order_id:order_id};
	app.ajax("lf_order/view",obj, function(param) {
		$("#p_name").html(param.product_name);
		$("#order_num").html(param.order_num);
		$("#buy_time").html(param.buy_time);
		$("#buy_price").html(param.buy_price+"元");
		$("#buy_count").html(param.buy_count+"手");
		if(param.buy_type=='1'){
			$("#buy_type").html("买涨");
		}else{
			$("#buy_type").html("买跌");
		}
		var up_earn = parseFloat(param.up_earn)*100;
		$("#userResult").html(up_earn+"%");
		var low_earn = parseFloat(param.low_earn)*100;
		$("#userResult2").html(low_earn+"%");
		$("#order_money").html(param.order_money+"元");
		$("#order_fee").html(param.fee+"元");
		
		initOrder();
	});
}

var timer = null;
var money=0;
function initOrder(){
	var obj = {order_id:order_id};
	app.ajax("lf_order/view",obj, function(param) {
		$("#pprice").html(param.sale_price+"元");
		$("#earn").html(param.earn+"元");
		if(param.sale_price=='0'&&param.earn=='0'){
			$("#commit_sale").attr("disabled",true);
		}else{
			$("#commit_sale").removeAttr("disabled");
		}
		
		money = (Math.abs(param.earn)/param.order_money)*100;
		money = money.toFixed(2);
		if(param.earn<0){
			$("#per-earn").html("-"+money+"%");
			$("#earn").addClass("product-down-number-info").removeClass("product-up-number-info");
			$(".icon-up").addClass("icon-down").removeClass("icon-up");
			$(".index-product-up").addClass("index-product-down").removeClass("index-product-up");
		}else{
			$("#per-earn").html("+"+money+"%");
			$("#earn").addClass("product-up-number-info").removeClass("product-down-number-info");
			$(".icon-down").addClass("icon-up").removeClass("icon-down");
			$(".index-product-down").addClass("index-product-up").removeClass("index-product-down");
		}			
		$("#order_earn").html(param.order_earn+"元");
		
		var isTime = localStorage.getItem("isTime");
		if(isTime==5){
			timer = setTimeout("initOrder()",2000);
		}else{
			window.clearTimeout(timer);
		}
	});
}

function sale(){
	var obj = {order_id:order_id};
	$("#commit_sale").attr("disabled",true);
	app.ajax("lf_trade/sale",obj, function(param) {
		mui.toast("平仓成功");
		$("#commit_sale").removeAttr("disabled");
		mui.back();
	});
}