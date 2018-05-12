mui.init({
		swipeBack:true //启用右滑关闭功能
	});
	mui.init({
		beforeback: function() {
			var wobj = plus.webview.getWebviewById("page/trade/trade.html");
        	mui.fire(wobj,'tradeEvent');
			localStorage.setItem("isTime","2");
			return true;
		}
	});
	
	var pid=0,code=0,psid=0;
	var productSale;
	var ct=0;
	var buytype;
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		pid = self.pid;
		code = self.code;
		psid = self.psid;
		buytype = self.buytype;
		
		if(self.buytype=='2'){
			$(".product-buy-up-type").addClass("product-buy-down-type").removeClass("product-buy-up-type");
			$(".icon-up").addClass("icon-down").removeClass("icon-up");
			$(".product-up-number-info").addClass("product-down-number-info").removeClass("product-up-number-info");
			$(".buy-type").html("买跌");
		}
		
		var obj = {psid:psid};
		ct = $("li.on span span").html();
		app.ajax("lf_productSale/view",obj, function(param) {
			productSale = param;
			document.querySelector(".mui-title").textContent = param.product_name;
			document.querySelector(".p-title").textContent = param.product_name;
			$(".p-price").html(param.price);
			countPrice(ct);
		});
		
		localStorage.setItem("isTime","3");
		loadProduct();
	
	});
	
	var timer = null;
	function loadProduct(){
		var obj = {id:pid,code:code};
		app.ajax("lf_product",obj, function(param) {
			var product_sale = eval("("+param.json+")");
			if(product_sale){
				document.querySelector(".now-price").textContent = product_sale.NewPrice;
			}
			var isTime = localStorage.getItem("isTime");
			if(isTime==3){
				timer = setTimeout("loadProduct()",2000);
			}else{
				window.clearTimeout(timer);
			}
		});
	}
	
	
	$(".buy-number li").click(function(e) {
		var isInp=$(this).hasClass("buy-number-li-input");
		$(this).addClass("on").siblings().removeClass("on");				
		if(!isInp){
			$(".buy-number-li-input input").val("");
		}
		var ct = $(this).find(".buy-ct").html();
		if(productSale&&ct){
			countPrice(ct);
		}
	});
	var unit=" 手";
	$(".buy-number-li-input input").blur(function (e) {
		$(this).attr("placeholder","其他数额");
		$(this).attr("type","tel");
		var v=$(this).val().replace(unit,"");
		if(v!==""){
			$(this).val(v+unit);
			
			countPrice(v);
		}
	}).focus(function (e) {
		$(this).attr("placeholder","");
		$(this).attr("type","number");
		$(this).val("");
		$(this).parent().addClass("on").siblings().removeClass("on");
	});
	
	function countPrice(buyct){
		if(parseInt(buyct)<1){
			mui.toast("手数错误");
			return;
		}
		ct = buyct;
		var price = $(".p-price").html();
		var total_price = parseInt(ct)*parseFloat(price);
		total_price = total_price.toFixed(2);
		fee = parseInt(ct)*productSale.fee;
		fee = fee.toFixed(2);
		
		$(".fee").html(fee);
		$(".total_price").html(total_price);
		var order_price = parseFloat(fee)+parseFloat(total_price);
		order_price = order_price.toFixed(2);
		$(".order_price").html(order_price);
	}
	
	function buy(){
		var price = $(".p-price").html();
		var nowprice = $(".now-price").html();
		var orderprice = $(".order_price").html();
		var fee = $(".fee").html();
		if(!parseFloat(fee)){
			mui.toast("手续费无效");
			return;
		}
		if(ct<1){
			mui.toast("手数错误");
			return;
		}
		if(parseFloat(orderprice)<0){
			mui.toast("无效金额");
			return;
		}
		
		$("#buy-btn").attr("disabled",true);
		var state = app.getState(); //获取登陆信息
		var obj = {id:state.user.id,psid:psid,ct:ct,nowprice:nowprice,buytype:buytype};
		app.ajax("lf_trade/buy",obj, function(param) {
			mui.toast("购买成功");
			$("#buy-btn").removeAttr("disabled");
			mui.back();
		})
	}