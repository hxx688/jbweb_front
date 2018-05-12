mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			up: {
				contentrefresh: '正在加载...',
				contentnomore:'',
				callback: loadTrade,
				auto: true
			}
		}
	});
	
	var pageNo = 1;
	var pagecount = 0;
			
	function loadTrade(){
		var date=new Date;
		setDate(date);
		var state = app.getState(); //获取登陆信息
		var month = document.querySelector(".year").textContent;
		var obj = {pageNo: pageNo,pageSize: APP.PageSize,id:state.user.id,month:month};
		app.ajax("lf_order/list",obj, function(data) {
			pagecount = data.total;
			var datas = data.rows;
			var table = document.body.querySelector('.mui-table-view');
			for(var i = 0;i < datas.length; i++) {
				var order = datas[i];
				var buy_type = "up";
				var earn_type = "up";
				var earn_money = "0";
				var buy_count = "买涨"+order.buy_count+"手";
				var status = "<span style='color:red'>待售</span>"
				if(order.earn>0){
					earn_type = "up";
				}else{
					earn_type = "down";					
				}
				earn_money = order.earn;
				
				if(order.buy_type==2){
					buy_type = "down";
					buy_count = "买跌"+order.buy_count+"手";
				}
				if(order.status==2){
					status = "<span style=''>"+order.buy_time+"</span>";
				}
				
				li = document.createElement('li');
				li.classList.add("mui-table-view-cell2");
				li.onclick = view;
				li.id = order.id;
				li.style.padding = "1px";
				var btnHtml = 	'<div class="mui-card" style="margin:5px 10px;">'+
					            '    <div class="mui-card-content">'+
					            '        <div class="mui-card-content-inner Position-list">'+
					            '            <div class="Position-list-title">'+
					            '                <span class="Position-list-id">订单号：'+order.order_num+'</span>'+
					            '				　<span class="Position-list-time">'+status+'</span>'+
					            '            </div>'+
					            '            <div class="Position-list-info">'+
					            '                <span class="index-product-'+earn_type+'">'+earn_money+'</span>'+
					            '                <div class="index-product-number-'+buy_type+'">'+
					            '                   <span class="iconfont icon-'+buy_type+'"></span><span class="product-'+buy_type+'-number-info">'+buy_count+'</span>'+
					            '                </div>'+
					            '                '+order.product_name+'<span class="Position-list-info-id">（'+order.code_name+'）</span>'+
					            '            </div>'+
					            '            <div class="Position-list-date">'+
					            '            	<span>平仓：'+order.sale_time+'</span>'+
					            '            </div>'+
					            '        </div>'+
					            '    </div>'+
					            '</div>';
				
				li.innerHTML = btnHtml;
				table.appendChild(li);
			}

			if(pagecount==0||pagecount==1){
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			}else{
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(pagecount==pageNo); //参数为true代表没有更多数据了。
			}
			
			pageNo = pageNo + 1;
			if(pagecount==0){
				document.querySelector(".mui-pull-caption").textContent = "没有数据";
			}
		});
	}
	
	mui.plusReady(function() {
		var date=new Date;
		setDate(date);
		
		mui(".trade-history-header").on('tap','.mui-action-prev',function(e){
		 	var d = lastDay;
			d.setMonth(d.getMonth()-1);
			setDate(d);
			pageNo = 1;
			document.body.querySelector('.mui-table-view').innerHTML = "";
			loadTrade();
		});
		
		mui(".trade-history-header").on('tap','.mui-action-next',function(e){
		 	var d = lastDay;
			d.setMonth(d.getMonth()+1);
			setDate(d);
			pageNo = 1;
			document.body.querySelector('.mui-table-view').innerHTML = "";
			loadTrade();
		});
	});
	
	var lastDay;
	function setDate(date){
		lastDay = date;
		var year=date.getFullYear(); 
		var month=date.getMonth()+1;
		month =(month<10 ? "0"+month:month); 
		var mydate = (year.toString()+"-"+month.toString());
		document.querySelector(".year").textContent = mydate;
	}
	
	function view(){
		var order_id = $(this).attr("id");
		mui.openWindow({url:"../order/position_info_over.html",extras: {order_id: order_id}});	
	}