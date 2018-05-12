//服务端配置
var API = {
	API_ROOT : "http://192.168.31.186:8080",
//	API_ROOT : "http://47.75.88.114",
	API_VERSION : '1.5.5',
	API_URL : function(method){
		return this.API_ROOT +'/clientService?serviceId='+method+'&iscrypt=2&version=' + this.API_VERSION+"&time="+new Date().getTime();
	}
}

//客户端配置
var APP ={
	//列表页数
	PageSize  : 20
}

function exitApp(){
	var wobj = plus.webview.getWebviewById("H5F94A4F8");
	if(!wobj){
		wobj = plus.webview.getWebviewById("HBuilder");
	}
    mui.fire(wobj,'loginEvent');
    app.setState({});	  
	localStorage.clear();
	wobj.show();
}
