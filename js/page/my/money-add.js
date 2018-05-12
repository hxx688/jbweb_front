mui.init({
	swipeBack:true //启用右滑关闭功能
});

$(".buy-number li").click(function(e) {
	var isInp=$(this).hasClass("buy-number-li-input");
	$(this).addClass("on").siblings().removeClass("on");
	if(!isInp){
		$(".buy-number-li-input input").val("");
	}
});
var unit=" 元";
$(".buy-number-li-input input").blur(function (e) {
	$(this).attr("placeholder","其他数额");
	$(this).attr("type","tel");
	var v=$(this).val().replace(unit,"");
	if(v!==""){
		$(this).val(v+unit);
	}
}).focus(function (e) {
	$(this).attr("placeholder","");
	$(this).attr("type","number");
	$(this).val("");
	$(this).parent().addClass("on").siblings().removeClass("on");
});

mui.plusReady(function() {
	document.addEventListener('money-addEvent', function(event) {
		init();
	});
	init();
});

function next(){
	var state = app.getState(); //获取登陆信息
	
	var money = $("li.on span font").html();
	if(!money){
		money = $(".buy-number-li-input input").val();
		money = money.replace("元","");
	}

	money = parseFloat(money);
	if(!(money>0)){
		mui.toast("无效金额");
		return;
	}
	
	var phone = $("#phone").val();
	var idcard = $("#idcard").val();
	var account = $("#account").val();
	var kaihuming = $("#kaihuming").val();
	if(!phone){
		mui.toast("请输入手机号码");
		return;
	}
	if(!idcard){
		mui.toast("请输入身份证");
		return;
	}
	if(!account){
		mui.toast("请输入银行卡号");
		return;
	}
	
	var obj = {id:state.user.id,phone:phone,idcard:idcard,account:account,kaihuming:kaihuming};
	app.ajax("lf_person/payInfo",obj, function(param) {
		mui.openWindow({url:"money-add-end.html",extras: {money:money}});	
	});
}
function init(){
	var state = app.getState(); //获取登陆信息
	var obj = {id:state.user.id};
	app.ajax("lf_person/info",obj, function(param) {
		document.querySelector(".realname").textContent = param.real_name;
		document.querySelector(".my-username").textContent = "("+param.mobile+")";
		document.querySelector(".my-amount").textContent = param.amount;
		$("#phone").val(param.mobile);
		$("#idcard").val(param.idcart);
		$("#account").val(param.bank_acount);
		if(param.kaihuming){
			$("#kaihuming").val(param.kaihuming);
		}else{
			$("#kaihuming").val(param.real_name);
		}
		
	});
}