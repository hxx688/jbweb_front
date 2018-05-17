mui.init({
		swipeBack:true //启用右滑关闭功能
	});
	
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	var data = self.param;
	for(var key in data){
	    if('mobile_param' == key) {
	        if(data[key] && data[key].indexOf("get") != -1) {
                document.forms['paysubmit'].method = "GET";
            }
        }

        if('pay_url'==key){
//      	mui.toast('pay_url:'+data[key]);
            document.forms['paysubmit'].action = data[key];

        }else{
        	var input = document.createElement('input');
			input.setAttribute('type', 'hidden');
			input.setAttribute('name', key);
			input.setAttribute('value', data[key]);
//			input.setAttribute('value', key+":"+data[key]);
			
			document.forms['paysubmit'].appendChild(input);
        }
    } 
	
	document.forms['paysubmit'].submit();
});
