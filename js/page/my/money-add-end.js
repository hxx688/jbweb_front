var money;
mui.init({
	beforeback: function() {
		var wobj = plus.webview.getWebviewById("lf_my.html");
        mui.fire(wobj,'myEvent');
        wobj.show();
		return true;
	}
});
			
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	money = self.money;
	document.querySelector(".index-my-money-number").textContent = money;
});

function commit(){
	var state = app.getState(); //获取登陆信息
	var payCode = "";
	var checkVal = "";
	var radio = document.getElementsByName("radioPayType");  
    for (i=0; i<radio.length; i++) {  
        if (radio[i].checked) {
            checkVal = radio[i].value;
        }  
    } 

	

	if(!money || money <= 0){
		mui.toast("金额应大于0");
		return;
	}
    
	var obj = {id:state.user.id,money:money, payChannel: checkVal};
	
	app.ajax("lf_prepay_factory/getPayUrl",obj, function(param) {
			// 跳转到支付url
			mui.openWindow({url:"shanpay.html",extras: {param:param}});
	});
	
}