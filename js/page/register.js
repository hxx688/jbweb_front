mui.init({
	swipeBack:true //启用右滑关闭功能
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
document.getElementById("hqyzm").onclick=function(){
	
}
//获取验证码倒计时 结束

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
	var real_name = document.getElementById("real_name").value;
	var password = document.getElementById("password").value;
	var tuijian = document.getElementById("tuijian").value;
	if(mobile.length == 0) {
		mui.toast('手机号码不能为空');
		return;
	}
	if(code.length == 0) {
		mui.toast('验证码不能为空');
		return;
	}
	if(real_name.length == 0) {
		mui.toast('真实姓名不能为空');
		return;
	}
	if(password.length == 0) {
		mui.toast('密码不能为空');
		return;
	}
	var obj = {
				mobile: mobile,
				code: code,
				real_name: real_name,
				password: password,
				tuijian: tuijian
			};
	app.ajax("lfgj_personRegister",obj, function(param) {
		mui.toast('注册成功');
		mui.back();
	});
})