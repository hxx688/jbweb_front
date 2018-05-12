/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		if(loginInfo.username.length == 0) {
			return callback('账号不能为空');
		}
		if(loginInfo.password.length == 0) {
			return callback('密码不能为空');
		}
		var url = API.API_URL("lfgj_personLogin");
		var params= {'username':loginInfo.username,'password':loginInfo.password};
		mui.ajax(url, {
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			data: params,
			timeout: 10000, //超时时间设置为10秒；
			headers: {
				'Accept': 'application/json'
			},
			success: function(data) {
				//服务器返回响应
				if(data.returnCode == 0){
					var user = data.returnParams;
					return owner.createState(user, callback);
				}else{
					plus.nativeUI.toast(data.returnMsg);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast("网络异常,请稍候再试");
			}
		});
	};

	owner.createState = function(user, callback) {
		var state = owner.getState();
		state.user = user;
		state.mobile = user.mobile;
		owner.setState(state);
		return callback();
	};

	/**
	 * 
	 **/
	owner.ajax = function(method,regInfo, callback) {
		callback = callback || $.noop;	
		var url = API.API_URL(method);
		mui.ajax(url, {
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			data: regInfo,
			timeout: 10000, //超时时间设置为10秒；
			headers: {
				'Accept': 'application/json'
			},
			success: function(data) {
				//服务器返回响应
				if(data.returnCode == 0){
					return callback(data.returnParams);
				}else{
					mui.toast(data.returnMsg);
					if(mui('#pullrefresh')&&mui('#pullrefresh').pullRefresh()){
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						mui('#pullrefresh').pullRefresh().endPulldown();
					}
					if(document.querySelector(".mui-btn")){
						document.querySelector(".mui-btn").removeAttribute("disabled");
					}
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast("网络异常,请稍候再试");
				if(mui('#pullrefresh')&&mui('#pullrefresh').pullRefresh()){
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					if(mui('#pullrefresh').pullRefresh().endPulldown)
						mui('#pullrefresh').pullRefresh().endPulldown();
				}
			}
		});
	};
	
	/**
	 * 发送验证码
	 **/
	owner.sendSMS = function(mobile, callback) {
		callback = callback || $.noop;
		mobile = mobile || {};		
		if(mobile.mobile.length == 0) {
			return callback('手机号码不能为空');
		}
		var url = API.API_URL("lf_sendsms");
		var params= {'mobile':mobile.mobile};
		mui.ajax(url, {
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			data: params,
			timeout: 10000, //超时时间设置为10秒；
			headers: {
				'Accept': 'application/json'
			},
			success: function(data) {			
				//服务器返回响应
				if(data.returnCode == 0){
					return callback();
				}else{
					plus.nativeUI.toast(data.returnMsg);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast("网络异常,请稍候再试");
			}
		});
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return(email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if(!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	owner.clearView = function(){
		var curr = plus.webview.currentWebview();
        var wvs = plus.webview.all();
        for (var i = 0, len = wvs.length; i < len; i++) {
            if (wvs[i].getURL() == curr.getURL()){
            	continue;
            }else{
            	wvs[i].close('none'); 　
            }
        }
	}
	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));