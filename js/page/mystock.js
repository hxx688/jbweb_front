mui.plusReady(function() {
	document.addEventListener('mystockEvent', function(event) {
		localStorage.setItem("isTime","4");
		init();
	});
});

var timer = null;
function init(){
	var state = app.getState(); //获取登陆信息
	var obj = {id:state.user.id};
	app.ajax("lf_order/index",obj, function(param) {
		var orders = param.orders;
		var totalEarn = param.totalEarn;
		document.querySelector(".Position-list-number-info").textContent = orders.length;
		if(totalEarn>0){
			$(".total-earn").addClass("Position-Profit-number-info-up");
			$(".total-earn").removeClass("Position-Profit-number-info-down");
			$(".total-earn").html(totalEarn);
		}else{
			$(".total-earn").addClass("Position-Profit-number-info-down");
			$(".total-earn").removeClass("Position-Profit-number-info-up");
			$(".total-earn").html(totalEarn);
		}
		var content = document.querySelector('.mui-stock');
		content.innerHTML = "";
		if(orders.length==0){
			var div = document.createElement("div");
			div.innerHTML="没有订单";
			div.classList.add("no_order");
			content.appendChild(div);
			return;
		}
		
		var count = 0;
		for(var i=0;i<orders.length;i++){
			var order = orders[i];
			var earn = order.earn;
			var buy_type = order.buy_type;
			var ct = order.buy_count;
			count += ct;
			var div = document.createElement("div");
			div.classList.add("mui-card");
			div.classList.add(order.code);
			div.onclick = view;
			div.id = order.id;
			var html = '<div class="mui-card-content" price="'+order.buy_price+'" buytype="'+order.buy_type+'">'+
			                '    <div class="mui-card-content-inner Position-list">'+
			                '        <div class="Position-list-title">'+
			                '        	<span class="Position-list-id">订单号：'+order.order_num+'</span>'+
			                '           <span class="Position-list-time">'+order.buy_time+'</span>'+
			                '        </div>'+
			                '       <div class="Position-list-info">';
			if(earn>0){
				html += '<span class="earn index-product-up">'+earn+'</span>';
			}else{
				html += '<span class="earn index-product-down">'+earn+'</span>';
			}
		    if(buy_type=='1'){            
				 html +=          '       		<div class="index-product-number-up">'+
				                '            	<span class="iconfont icon-up"></span><span class="product-up-number-info">买涨'+ct+'手</span>'+
				                '            </div>';
		    }else{
			     html +=           '       		<div class="index-product-number-down">'+
				                '            	<span class="iconfont icon-down"></span><span class="product-down-number-info">买跌'+ct+'手</span>'+
				                '           </div>';
		    }
		    
		    html +='            '+order.product_name+'<span class="Position-list-info-id">（'+order.code+'）</span>'+
		                '        </div>'+
		                '    </div>'+
		                '</div>';
			div.innerHTML = html;         
			content.appendChild(div);                
		}
		
		document.querySelector(".Position-trade-number-info").textContent = count;
		
		var isTime = localStorage.getItem("isTime");
		if(isTime==4){
			timer = setTimeout("init()",3000);
		}else{
			 window.clearTimeout(timer);
		}
		
	});
	
	
}

function view(){
	var order_id = $(this).attr("id");
	mui.openWindow({url:"page/order/position_info.html",extras: {order_id: order_id}});	
}