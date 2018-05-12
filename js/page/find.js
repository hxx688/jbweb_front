mui.plusReady(function() {
	document.addEventListener('findEvent', function(event) {
		var state = app.getState(); //获取登陆信息
		var obj = {is_agent:state.user.is_agent};
		app.ajax("lf_find/index",obj, function(param) {
			var top = param.top.top;
			var tops = top.split('\r\n');
			
			var list = document.querySelector(".find-ranking-list");
			list.innerHTML = "";
			for(var i=0;i<tops.length;i++){
				var rec = tops[i].split(",");
				var div = document.createElement("div");
				div.classList.add('find-ranking-list-title');
				div.innerHTML = '<span class="find-ranking-number">'+(i+1)+'</span>'+
                    			'<span class="find-ranking-name">'+rec[0]+'</span>'+
                    			'<span class="find-ranking-Profit">'+rec[1]+'元</span>';
                list.appendChild(div);
			}
			
			var articles = param.articles;
			var table = document.body.querySelector('.mui-table-view');
			table.innerHTML = "";
			for(var i = 0;i < articles.length; i++) {
				var notice = articles[i];
				li = document.createElement('li');
				li.id = notice.id;
				li.classList.add("mui-table-view-cell");
				var btnHmtl = 	'<div class="mui-table">'
		                        +	'<div class="mui-table-cell mui-col-xs-10">'
			                    +       '<h4 class="mui-ellipsis">'+notice.title+'</h4>'
			                    +        '<p class="mui-h6 mui-ellipsis">'+notice.add_time+'</p>'
			                    +    '</div>'
			                    +'</div>';
				li.innerHTML = btnHmtl;
				table.appendChild(li);
			}
		});
	});
	
	mui(".app-title").on('tap','a', function(e) {
		mui.openWindow('page/notice/notice-list.html');
	});
	
	mui(".mui-table-view").on('tap','.mui-table-view-cell',function(){
	  	var nid = this.getAttribute("id");
	  	mui.openWindow({url:'page/notice/article.html',extras: {nid: nid}});
	});
});
