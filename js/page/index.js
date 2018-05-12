mui.init({
	swipeBack:true //启用右滑关闭功能
});

mui.plusReady(function() {
	
	init();
	
	mui(".notice-first").on('tap','.mui-table-view-cell', function(e) {
		mui.openWindow('page/notice/notice-list.html');
	});
	
	mui(".product_table_view").on('tap','.mui-table-view-cell',function(){
	  	var pid = this.getAttribute("id");
	  	var code = this.getAttribute("code");
	  	if(!pid){
	  		mui.toast("产品无效");
	  		return;
	  	}
	  	mui.openWindow({url:'page/trade/trade.html',extras: {pid: pid,code: code}});
	});

	loadProduct();
	document.addEventListener('indexEvent', function(event) {
		//init();
		loadProduct();
	});
});

function init(){
	var obj = {};
	app.ajax("lf_index",obj, function(param) {
		var article = param.article;
		var imgList = param.imgList;
		var imgList1 = param.imgList1;
		var imgList2 = param.imgList1;
		var url1="",url2="";
		if(imgList1){
			url1 = imgList1.url;
		}
		if(imgList2){
			url2 = imgList2.url;
		}
		if(article){
			document.getElementById("first_news").innerHTML = article.title;
		}
		
		var group = document.body.querySelector(".mui-slider-group");
		group.innerHTML = "";
		var div = document.createElement("div");
		div.classList.add("mui-slider-item");
		div.classList.add("mui-slider-item-duplicate");
		div.innerHTML = ' <a href="#">'+
                       	' 	<img style="height:150px;" src="'+API.API_ROOT+url1+'">'+
                    	' </a>';

		group.appendChild(div);
		if(imgList){
			for(var i=0;i<imgList.length;i++){
				var img = imgList[i];
				
				div = document.createElement("div");
				div.classList.add("mui-slider-item");
				div.innerHTML = ' <a href="#">'+
                           	' 	<img style="height:150px;" src="'+API.API_ROOT+img.url+'">'+
                        	' </a>';
				group.appendChild(div);
			}
		}
		div = document.createElement("div");
		div.classList.add("mui-slider-item");
		div.classList.add("mui-slider-item-duplicate");
		div.innerHTML = ' <a href="#">'+
                       	' 	<img style="height:150px;" src="'+API.API_ROOT+url2+'">'+
                    	' </a>';
		group.appendChild(div);

		var indicator = document.querySelector(".mui-slider-indicator");	
		indicator.innerHTML = "";
		if(imgList){
			for(var i=0;i<imgList.length;i++){
				div = document.createElement("div");
				if(i==0){
					div.classList.add("mui-active");
				}
				div.classList.add("mui-indicator");
				indicator.appendChild(div);
			}
		}
		
		var slider = mui("#slider");
		slider.slider({
			interval: 3000
		});	
	});
	
}

var timer = null;
function loadProduct(){
	var obj = {};
	app.ajax("lf_productList",obj, function(param) {
		var table = document.querySelector(".product_table_view");
		table.innerHTML = "";
		if(param){
			for(var i = 0;i < param.length; i++) {
				var product = param[i];
				var p_name = product.product_name;
				if(product.isSale&&product.isSale=='0'){
					p_name = "非交易时间";
				}
				
				var product_sale = eval("("+product.json+")");
				var isup = "up";
				if(product_sale.LastClose>product_sale.NewPrice){
					isup = "down";
				}
				var bili = (parseFloat(product_sale.NewPrice)-parseFloat(product_sale.LastClose))/parseFloat(product_sale.LastClose)*100;
				bili = bili.toFixed(2);
				if(isNaN(bili)){
					bili = "0";
				}
				li = document.createElement('li');
				li.classList.add("mui-table-view-cell");
				li.id = product.id;
				li.setAttribute("code",product.code);
				var btnHmtl = 	'<a class="mui-navigate-right index-product-list" style="padding-right:40px;">'+
		                        '    <div class="index-product-list-info">'+
		                        '        <div class="index-product-list-old">'+
		                        '        	买涨：&nbsp;<span style="display:inline-block;width:60px;">'+product_sale.High+'</span><br/>'+
		                        '            买跌：&nbsp;<span style="display:inline-block;width:60px;">'+product_sale.Low+'</span>'+
		                        '        </div>'+
		                        '        <span style="display:inline-block;width:50px;text-align:right;" class="index-product-'+isup+'">'+bili+'%</span>'+
		                        '   		<div style="float:left;" class="index-product-number-'+isup+'">'+
		                        '        	<span class="iconfont icon-'+isup+'"></span><span class="product-'+isup+'-number-info">'+product_sale.NewPrice+'</span>'+
		                        '        </div>'+
		                        '    </div>'+
		                        '	'+p_name+
		                        '</a>';
		     
				li.innerHTML = btnHmtl;
				table.appendChild(li);
			}
		}
		
		var isTime = localStorage.getItem("isTime");
		if(isTime==1){
			timer = setTimeout("loadProduct()",3000);
		}else{
			 window.clearTimeout(timer);
		}
	});
}