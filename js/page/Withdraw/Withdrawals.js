mui.init({
		beforeback: function() {
			var wobj = plus.webview.getWebviewById("lf_my.html");
            mui.fire(wobj,'myEvent');
			return true;
		}
	});
	
	var userPicker;
	var cityPicker3;
	(function($, doc) {
		$.init();
		$.ready(function() {
			//
			userPicker = new $.PopPicker();
			cityPicker3 = new $.PopPicker({
				layer: 2
			});
			
			var moneyObj = document.getElementById("cashmoney");
			moneyObj.addEventListener("blur",function(e){
				getFee();
			});
			
			openBank();
			openArea();
			//-----------------------------------------
	
		});
	})(mui, document);
	
	mui.plusReady(function() {
		init();
	});
	
	function getFee(){
		document.querySelector(".pay-fee").textContent = "";
		var fee = document.querySelector(".cashfee").textContent;
		var moneyObj = document.getElementById("cashmoney");
		var money = moneyObj.value;
		if(!fee){
			mui.toast("数据异常！请联系客服");
			return;
		}
		
		money = parseFloat(money);
		if(!(money>0)){
			mui.toast("金额错误");
			return;
		}
		
		if(money % 100 != 0){
			mui.toast("只能取100的倍数");
			return;
		}
		var payfee = parseFloat(fee)*money/100;
		payfee = payfee.toFixed(2);
		document.querySelector(".pay-fee").textContent = payfee;
	}
	
	function openBank(){
		userPicker.setData([
				"中国建设银行","中国工商银行","中国银行","招商银行","兴业银行","中国农业银行"
			]);
		var showUserPickerButton = document.getElementById('showUserPicker');
		var userResult = document.getElementById('showUserPicker');
		showUserPickerButton.addEventListener('tap', function(event) {
			userPicker.show(function(items) {
				document.getElementById('my-bank').innerText = items[0].text;
			//返回 false 可以阻止选择框的关闭
			//return false;
		});
		}, false);
	}
	
	function openArea(){
		var _getParam = function(obj, param) {
			return obj[param] || '';
		};
		//地区三级联示例
		cityPicker3.setData(cityData3);
		var showCityPickerButton = document.getElementById('showCityPicker3');
		var cityResult3 = document.getElementById('showCityPicker3');
		showCityPickerButton.addEventListener('tap', function(event) {
			cityPicker3.show(function(items) {
				document.getElementById('my-area').innerText = _getParam(items[0], 'text') + " " + _getParam(items[1], 'text');
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
		}, false);
	}
	
	function init(){
		var state = app.getState(); //获取登陆信息
		var obj = {id:state.user.id};
		app.ajax("lf_withdraw/index",obj, function(param) {
			var person = param.person;
			var banks = param.banks;
			var yinghanka = param.yinghanka;
			
			document.querySelector(".realname").textContent = person.real_name;
			document.querySelector(".my-username").textContent = "("+person.mobile+")";
			document.querySelector(".my-amount").textContent = person.amount;
			document.getElementById("idcard").value = person.idcart;
			if(!person.kaihuming){
				document.getElementById("my-name").value = person.real_name;		
			}else{
				document.getElementById("my-name").value = person.kaihuming;			
			}
			
			var cashfee = person.cashFee * 100;
			document.querySelector(".cashfee").textContent = cashfee;
			
			
			var bank_name = "";
			var bindmobile = "";
			
			if(yinghanka){
				document.getElementById("my-account").value = yinghanka.kahao;
				document.getElementById("zhihang").value = yinghanka.xiangxindizhi;
				document.getElementById("ka_id").value = yinghanka.id;			
				
				var my_area = yinghanka.sheng+" "+ yinghanka.shi;
				if(my_area){
					document.getElementById("my-area").textContent = my_area;
					document.getElementById("my-area").style.color = "#000000";	
				}
				
				bank_name = yinghanka.kaihuhang;
				bindmobile = yinghanka.mobile;
			}
					
			if(!bank_name){
				bank_name = person.bank_name;
			}
			if(bank_name){
				document.getElementById("my-bank").textContent = bank_name;
				document.getElementById("my-bank").style.color = "#000000";	
			}	
						
			if(!bindmobile){
				bindmobile = person.bank_mobile;
			}		
			document.querySelector(".bindmobile").value = bindmobile;
			
			userPicker.setData(banks);
		});
	}
	
	function cashMoney(){
		var state = app.getState(); //获取登陆信息
		var amount = document.getElementById("cashmoney").value;
		var paypwd = document.querySelector(".mui-input-password").value;
		var bank_acount = document.getElementById("my-account").value;
		var bank_name = document.getElementById("my-bank").textContent;
		var myname = document.getElementById("my-name").value;
		var fee = document.querySelector(".pay-fee").textContent;
		var bindmobile = document.querySelector(".bindmobile").value;
		var city = document.getElementById('my-area').textContent;
		var zhihang = document.getElementById("zhihang").value;
		var ka_id = document.getElementById("ka_id").value;
		var idcard = document.getElementById("idcard").value;
		
		if(!fee){
			mui.toast("金额错误");
			return;
		}
		
		if(!amount){
			mui.toast("金额不能为空");
			return;
		}
		if(!paypwd){
			mui.toast("请输入提现密码");
			return;
		}
		if(!bank_acount){
			mui.toast("请输入卡号");
			return;
		}
		
		if(!bank_name||bank_name=='选择开户行'){
			mui.toast("请选择开户行");
			return;
		}
		if(!myname){
			mui.toast("开户名不能为空");
			return;
		}
		if(!city||city=='选择地区'){
			mui.toast("请选择地区");
			return;
		}
		
		if(!zhihang){
			mui.toast("请输入支行");
			return;
		}
		
		$("#withmoney_btn").attr("disabled",true);
		
		var obj = {id:state.user.id,idcard:idcard,amount:amount,paypwd:paypwd,bank_acount:bank_acount,bank_name:bank_name,myname:myname,bindmobile:bindmobile,city:city,zhihang:zhihang,ka_id:ka_id};
		app.ajax("lf_withdraw/add",obj, function(param) {
			mui.toast("提现申请成功");
			$("#withmoney_btn").removeAttr("disabled");
			document.querySelector(".pay-fee").textContent = "";
			document.getElementById("cashmoney").value="";
			document.querySelector(".mui-input-password").value = "";
			init();
		});
	}
	