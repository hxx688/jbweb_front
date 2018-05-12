(function($, doc) {
	$.init({
		beforeback: function() {
			localStorage.clear();
			return true;
		}
	});
	$.plusReady(function() {
		var settings = app.getSettings();
		var state = app.getState();
		document.addEventListener('loginEvent', function(event) {
			var passwordBox = doc.getElementById('password');
			passwordBox.value = "";
			app.clearView();
		});
		
		app.setState({});	  
		localStorage.clear();

		var toMain = function() {									
			app.clearView();
			mui.openWindow('lf_main.html');
		};
		
		var login = function(n,v){
			var loginInfo = {
				username: n,
				password: v
			};
			app.login(loginInfo, function(err) {
				if(err) {
					plus.nativeUI.toast(err);
					return;
				}else{
					plus.storage.setItem("user.name",n);
					plus.storage.setItem("user.pwd",v);
					plus.storage.setItem("user.auto",'1');
					toMain();
				}
			});
		}
		
		var autoLogin = function(){
			var name = plus.storage.getItem("user.name"); 
			var pwd = plus.storage.getItem("user.pwd"); 
			if(name&&pwd){
				doc.getElementById('username').value = name;
				login(name,pwd);
			}
		}
		
		var auto = plus.storage.getItem("user.auto"); 
		if(auto=='1') {
			autoLogin();
		}
		
		//检查 "登录状态/锁屏状态" 结束
		var loginButton = doc.getElementById('login');
		var usernameBox = doc.getElementById('username');
		var passwordBox = doc.getElementById('password');
		var regButton = doc.getElementById('reg');
		var forgetButton = doc.getElementById('forgetPassword');
		loginButton.addEventListener('tap', function(event) {			
			login(usernameBox.value,passwordBox.value);
		});
		
		forgetButton.addEventListener("tap",function(event){
			mui.openWindow('lf_findpassword.html');
		});
		
		regButton.addEventListener("tap",function(event){
			mui.openWindow('lf_register.html');
		});
		
		$.enterfocus('#login-form input', function() {
			$.trigger(loginButton, 'tap');
		});
	});
}(mui, document));
