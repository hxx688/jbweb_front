mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down : {
			      style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
			      color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
			      height:'50px',//可选,默认50px.下拉刷新控件的高度,
			      range:'100px', //可选 默认100px,控件可下拉拖拽的范围
			      offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
			      auto: true,//可选,默认false.首次加载自动上拉刷新一次
			      callback :reloadMsg //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
			    },
			up: {
				contentrefresh: '正在加载...',
				contentnomore:'',
				callback: loadMsg
			}
		}
	});
	
	var lastTime;
	mui.init({
		beforeback: function() {
			if(lastTime==1){
				var wobj = plus.webview.getWebviewById("lf_index.html");
        		mui.fire(wobj,'indexEvent');
			}
			if(lastTime==4){
				var wobj = plus.webview.getWebviewById("lf_mystock.html");
        		mui.fire(wobj,'mystockEvent');
			}
			localStorage.setItem("isTime",lastTime);
			return true;
		}
	});
	
	var pageNo = 1;
	var pagecount = 0;
	
	function reloadMsg(){
		pageNo = 1;
		var table = document.body.querySelector('.mui-table-view');
		table.innerHTML = "";
		loadMsg();
	}
	
	function loadMsg(){
		var state = app.getState(); //获取登陆信息
		if(!state.user){
			exitApp();
			return;
		}
		var obj = {pageNo: pageNo,pageSize: APP.PageSize,send_id:state.user.id};
		app.ajax("lf_customer/list",obj, function(data) {
			pagecount = data.total;
			var datas = data.rows;
			var table = document.body.querySelector('.mui-table-view');
			for(var i = 0;i < datas.length; i++) {
				var customer = datas[i];
				li = document.createElement('li');
				li.classList.add("mui-table-view-cell2");
				li.id = customer.id;
				li.style.padding = "1px";
				var replay_msg = "等待回复";
				if(customer.status==1){
					replay_msg = "<font style='color:red;'>"+customer.replay+"</font>";
				}
				var btnHmtl = 	'<div class="customer-time">'+customer.create_time+'</div>'+
					            '<div class="mui-card">'+
					            '    <div style="padding:8px 15px;">'+customer.msg+'</div>'+
					            '    <div class="Position-list-text"><span>客服回复：'+replay_msg+'</span></div>'+
					            '</div>';
				li.innerHTML = btnHmtl;
				table.appendChild(li);
			}
			
			if(pagecount==0||pagecount==1){
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			}else{
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(pagecount==pageNo); //参数为true代表没有更多数据了。
				
			}
			if(pageNo==1){
				mui('#pullrefresh').pullRefresh().endPulldown();
			}
			
			pageNo = pageNo + 1;
			if(pagecount==0){
				$(".mui-pull-caption").html("没有消息")
			}
		});
	}

	mui.plusReady(function() {
		lastTime = localStorage.getItem("isTime");
		localStorage.setItem("isTime","0");
		
		mui(".customer-button").on('click','.mui-btn',function(){
		  	var user = app.getState().user; //获取登陆信息
		  	var msgObj = document.getElementById("textarea");
		  	if(msgObj.value.length==0){
		  		mui.toast("请输入要发送的消息");return;
		  	}
		  	var obj = {send_id:user.id,msg:msgObj.value};
		  	app.ajax("lf_customer/add",obj, function(param) {
		  		mui.toast("发送成功");
		  		reloadMsg();
		  	});
		});
	});