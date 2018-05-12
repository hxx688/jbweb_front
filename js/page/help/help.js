mui.init({
		swipeBack:true //启用右滑关闭功能
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
	
	mui.plusReady(function() {
		lastTime = localStorage.getItem("isTime");
		localStorage.setItem("isTime","0");
		
		mui(".mui-table-view-cell").on('click','a',function(){
		  	var nid = this.getAttribute("id");
		  	mui.openWindow({url:'helpDetail.html',extras: {nid: nid}});
		});
	});