mui.init({
	swipeBack:true //启用右滑关闭功能
});
mui.plusReady(function() {
//	document.getElementById("login-pwd").onblur = function(){
//		changePwd();
//	}
//	document.getElementById("login-new-pwd").onblur = function(){
//		changePwd();
//	}
//	document.getElementById("login-confirm-pwd").onblur = function(){
//		changePwd();
//	}
	
//	$(".paypwd").bind("blur",function(){
//		changePayPwd();
//	});
});
function changePwd(){
	var state = app.getState(); //获取登陆信息
	var lpwd = document.getElementById("login-pwd").value;
	var npwd = document.getElementById("login-new-pwd").value;
	var confirm = document.getElementById("login-confirm-pwd").value;
	if(!lpwd){
		mui.toast("请输入原密码");
		return;
	}
	if(!npwd){
		mui.toast("请输入新密码");
		return;
	}
	if(!confirm){
		mui.toast("请输入确认密码");
		return;
	}
	
	if(npwd!=confirm){
			mui.toast("两次密码不一致");
			return;
	}
	
	var obj = {
				id: state.user.id,
				npassword: npwd,
				password: lpwd,
				ch_type: "1"
			};			
	
	app.ajax("lfgj_changePassword",obj, function(param) {
		mui.toast('登录密码修改成功');
	});
}

function changePayPwd(){
	var state = app.getState(); //获取登陆信息
	var paypwd = document.getElementById("paypwd").value;
	var npaypwd = document.getElementById("npaypwd").value;
	var confirmpaypwd = document.getElementById("confirmpaypwd").value;
	if(!paypwd){
		mui.toast("请输入原密码");
		return;
	}
	if(!npaypwd){
		mui.toast("请输入新密码");
		return;
	}
	if(!confirmpaypwd){
		mui.toast("请输入确认密码");
		return;
	}
	
	if(npaypwd!=confirmpaypwd){
		mui.toast("两次密码不一致");
		return;
	}
	
	var obj = {
				id: state.user.id,
				npassword: npaypwd,
				password: paypwd,
				ch_type: "2"
			};	
	
	app.ajax("lfgj_changePassword",obj, function(param) {
		mui.toast('支付密码修改成功');
	});
}

function saveLogin(){
	changePwd();
}

function savePay(){
	changePayPwd();
}
			