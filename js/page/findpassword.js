mui.init({
		swipeBack:true //启用右滑关闭功能
	});
	
	mui.plusReady(function() {
		var login_obj = document.getElementById("login_tab");
		var cash_obj = document.getElementById("cash_tab");
		var pwd_txt = document.getElementById("login_txt");
		var ch_type = document.getElementById("ch_type");
		login_obj.addEventListener('tap', function() {
			login_obj.classList.add("mui-active");
			cash_obj.classList.remove("mui-active");
			pwd_txt.textContent = "新登录密码";
			ch_type.value = "1";
		});
		
		cash_obj.addEventListener('tap', function() {
			cash_obj.classList.add("mui-active");
			login_obj.classList.remove("mui-active");
			pwd_txt.textContent = "新提现密码";
			ch_type.value = "2";
		});
	});
	//获取验证码倒计时
	var wait=60;
	function time(o) {
		if(wait == 0){
			o.removeAttribute("disabled");
			o.innerHTML="重新获取";
			o.style.backgroundColor="";
			o.style.color="";
			o.style.borderColor="";		
			wait = 60;
		} else {
			o.setAttribute("disabled", true);
			o.innerHTML="" + wait + "秒后重试";
			o.style.backgroundColor="#eee";
			o.style.color="#999";
			o.style.borderColor="#eee";
			wait--;
			setTimeout(function() {
				time(o);
				//$(".yzm_ts").get(0).style.display="";
			},1000);
		}
	}
	
	document.getElementById("hqyzm").addEventListener('tap', function() {
		var btn = document.getElementById("hqyzm");
		var mobile = document.getElementById("phone").value;
		var obj = {
					mobile: mobile
				};
		app.sendSMS(obj, function(err) {			
			if(err) {
				plus.nativeUI.toast(err);
				return;
			}else{
				time(btn);
				mui.toast('已发送验证码短信');
			}
		});
	});
	
	document.getElementById("commit").addEventListener('tap',function(){
		var mobile = document.getElementById("phone").value;
		var code = document.getElementById("code").value;
		var newPassword = document.getElementById("newPassword").value;
		var newPassword2 = document.getElementById("newPassword2").value;
		var ch_type = document.getElementById("ch_type").value;
		if(mobile.length == 0) {
			mui.toast('手机号码不能为空');
			return;
		}
		if(code.length == 0) {
			mui.toast('验证码不能为空');
			return;
		}
		if(newPassword.length == 0) {
			mui.toast('密码不能为空');
			return;
		}
		if(newPassword != newPassword2) {
			mui.toast('两次密码不一致');
			return;
		}
		var obj = {
					mobile: mobile,
					code: code,
					password: newPassword,
					ch_type: ch_type
				};
		app.ajax("lfgj_personFindPassword",obj, function(param) {
			mui.toast('修改成功');
			mui.back();
		});
	});