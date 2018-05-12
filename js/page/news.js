mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down : {
		      style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
		      color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
		      height:'50px',//可选,默认50px.下拉刷新控件的高度,
		      range:'100px', //可选 默认100px,控件可下拉拖拽的范围
		      offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
		      auto: true,//可选,默认false.首次加载自动上拉刷新一次
		      callback :reloadNews //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		    },
		up: {
			contentrefresh: '正在加载...',
			contentnomore:'',
			callback: loadNews
		}
	}
});

var pageNo = 1;
var pagecount = 0;

function reloadNews(){
	pageNo = 1;
	var table = document.body.querySelector('.mui-table-view');
	table.innerHTML = "";
	loadNews();
}

function loadNews(){
	var state = app.getState(); //获取登陆信息
	if(!state.user){
		exitApp();
		return;
	}
	var obj = {pageNo: pageNo,pageSize: APP.PageSize,is_agent:state.user.is_agent};
	app.ajax("lf_news/list",obj, function(data) {
		pagecount = data.total;
		var datas = data.rows;
		var table = document.body.querySelector('.mui-table-view');
		for(var i = 0;i < datas.length; i++) {
			var news = datas[i];
			li = document.createElement('li');
			li.classList.add("mui-table-view-cell");
			li.id = news.id;
			var btnHmtl = 	'<div class="mui-table">'
	                        +	'<div class="mui-table-cell mui-col-xs-10">'
		                    +       '<h4 class="mui-ellipsis">'+news.title+'</h4>'
		                    +        '<p class="mui-h6 mui-ellipsis">'+news.add_time+'</p>'
		                    +    '</div>'
		                    +'</div>';
			li.innerHTML = btnHmtl;
			table.appendChild(li);
		}
		
		if(pagecount==0||pagecount==1){
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		}else{
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(pagecount==pageNo); //参数为true代表没有更多数据了。
		
		}
		if(pageNo==1){
			mui('#pullrefresh').pullRefresh().endPulldown();
		}
		
		pageNo = pageNo + 1;
		if(pagecount==0){
			$(".mui-pull-caption").html("没有新闻")
		}
	});
}

mui(".mui-table-view").on('tap','.mui-table-view-cell',function(){
  	var nid = this.getAttribute("id");
  	mui.openWindow({url:'page/notice/article.html',extras: {nid: nid}});
});

mui.plusReady(function() {
	document.addEventListener('newsEvent', function(event) {
	
	});

});

