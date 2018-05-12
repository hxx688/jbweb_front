mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			contentrefresh: '正在加载...',
			contentnomore:'',
			callback: loadWithdraw,
			auto: true
		}
	}
});

var pageNo = 1;
var pagecount = 0;
		
function loadWithdraw(){
	var state = app.getState(); //获取登陆信息
	var obj = {pageNo: pageNo,pageSize: APP.PageSize,id:state.user.id};
	app.ajax("lf_withdraw/list",obj, function(data) {
		pagecount = data.total;
		var datas = data.rows;
		var table = document.body.querySelector('.mui-table-view');
		for(var i = 0;i < datas.length; i++) {
			var withdraw = datas[i];
			var withdraw_type = "Withdrawals-wait";
			var backHtml = "";
			var status_name = "待审核";
			if(withdraw.status==2){
				withdraw_type = "Withdrawals-yes";
				status_name = "已支付";
			}else if(withdraw.status==3){
				withdraw_type = "Withdrawals-no";
				status_name = "已退回";
				backHtml = '<div class="Position-list-text">'+
				            '  <span>拒绝理由：</span>'+withdraw.yuanyin+
				            '</div>';
			}else if(withdraw.status==5){
				withdraw_type = "Withdrawals-yes";
				status_name = "打款中";
			}else if(withdraw.status==6){
				withdraw_type = "Withdrawals-no";
				status_name = "付款失败";
				backHtml = '<div class="Position-list-text">'+
				            '  <span>原因：</span>'+withdraw.yuanyin+
				            '</div>';
			}
			
			li = document.createElement('li');
			li.classList.add("mui-table-view-cell2");
			li.style.padding = "1px";
			var btnHtml = 	'<div class="mui-card '+withdraw_type+'">'+
				            '    <div class="mui-card-content">'+
				            '        <div class="mui-card-content-inner Position-list">'+
				            '            <div class="Position-list-title">'+
				            '                <span class="Position-list-id">订单号：'+withdraw.tixianNum+'</span>'+
				            '                <span class="Position-list-time"></span>'+
				            '            </div>'+
				            '            <div class="Position-list-info">'+
				            '                <div class="Withdrawals-state">'+
				            '                    <span class="iconfont icon-list-wait"></span><span>'+status_name+'</span>'+
				            '                </div>'+
				            '                <span class="Withdrawals-number">提现金额：</span>'+withdraw.amount+'元'+
				            '           </div>'+backHtml+
				             '           <div class="Position-list-date">'+
				            '                <div class="">'+
				            '                    <span>'+withdraw.add_time+'</span>'+
				            '                </div>'
				            '           </div>'+
				            '        </div>'+
				            '    </div>'+
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
			document.querySelector(".mui-pull-caption").textContent = "没有数据";
		}
	});
}