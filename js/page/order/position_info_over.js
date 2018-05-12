mui.init({
	swipeBack:true //启用右滑关闭功能
});

var order_id;
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	order_id = self.order_id;
	firstInit();		
});

function firstInit(){
	var obj = {order_id:order_id};
	app.ajax("lf_order/view",obj, function(param) {
		$("#p_name").html(param.product_name);
		$("#order_num").html(param.order_num);
		$("#buy_time").html(param.buy_time);
		$("#buy_price").html(param.buy_price+"元");
		$("#sale_rice").html(param.sale_price+"元");	
		if(param.sale_price>param.buy_price){
			$(".sale .icon-down").addClass("icon-up").removeClass("icon-down");
			$(".sale .product-down-number-info").addClass("product-up-number-info").removeClass("product-down-number-info");	
		}else{
			$(".sale .icon-up").addClass("icon-down").removeClass("icon-up");
			$(".sale .product-up-number-info").addClass("product-down-number-info").removeClass("product-up-number-info");	
		}
		
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
		$("#order_earn").html(param.order_earn+"元");
		
		if(param.earn>0){
			$(".earn .icon-down").addClass("icon-up").removeClass("icon-down");
			$(".earn .product-down-number-info").addClass("product-up-number-info").removeClass("product-down-number-info");	
		}else{
			$(".earn .icon-up").addClass("icon-down").removeClass("icon-up");
			$(".earn .product-up-number-info").addClass("product-down-number-info").removeClass("product-up-number-info");	
		}
	});
}