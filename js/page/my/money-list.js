mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			contentrefresh: '正在加载...',
			contentnomore:'',
			callback: loadFinancial,
			auto: true
		}
	}
});

var pageNo = 1;
var pagecount = 0;
		
function loadFinancial(){
	var state = app.getState(); //获取登陆信息
	var obj = {pageNo: pageNo,pageSize: APP.PageSize,id:state.user.id};
	app.ajax("lf_financial/list",obj, function(datas) {
		document.querySelector(".sr-money").textContent = datas.sr;
		document.querySelector(".zc-money").textContent = datas.zc;
		var data = datas.grid;
		pagecount = data.total;
		var datas = data.rows;
		var table = document.body.querySelector('.mui-table-view');
		for(var i = 0;i < datas.length; i++) {
			var financial = datas[i];
			var type = '<span class="product-up-number-info">+'+financial.amount+'</span>';
			if(financial.financial_type==2){
				type = '<span class="product-down-number-info">-'+financial.amount+'</span>';					
			}
			var is_agent = state.user.is_agent;
			var desc = financial.desc;
			if(is_agent=='1'&&financial.source_type=="充值"){
				desc = "充值";
			}
			li = document.createElement('li');
			li.classList.add("mui-table-view-cell");
			li.classList.add("money-list");
			var btnHtml = 	'<div class="money-list-top">'+
		                    '	<span class="money-list-name">'+financial.source_type+'</span>'+
		                    '	<span class="money-list-time">'+financial.create_time+'</span>'+
		                    '</div>'+
		                    '<div class="money-list-bottom">'+type+
		                    ' '+desc+
		                    '</div>';
			
			li.innerHTML = btnHtml;
			table.appendChild(li);
		}
		
		if(pagecount==0||pagecount==1){
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		}else{
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(pagecount==pageNo); //参数为true代表没有更多数据了。
		}
		
		pageNo = pageNo + 1;
		if(pagecount==0){
			$(".mui-pull-caption").html("没有数据")
		}
	});
}	