//mui初始化  
		mui.init();
		var subpages = ['lf_index.html', 'lf_mystock.html', 'lf_news.html', 'lf_find.html', 'lf_my.html'];
		var subpage_style = {
			top: '45px',
			bottom: '51px' 
		};

		var aniShow = {};
		var canbank = -1;
		mui.init({
			beforeback: function() {
				var wvs=plus.webview.getWebviewById("lf_news.html");  
				wvs.canBack(function(e){
					canbank = e.canBack;
					if(canbank){
						wvs.back();
					}else{
						var btnArray = ['否', '是'];
		                mui.confirm('确定退出鸿宝财富？', '', btnArray, function(e) {
		                    if (e.index == 1) {
		                    	exitApp();
								return true;
		                    }
		                })
					}
				});
                return false;
			}
		});
		//创建子页面，首个选项卡页面显示，其它均隐藏；
		mui.plusReady(function() {
			
			var state = app.getState(); //获取登陆信息
			if(state.user) {	
				plus.nativeUI.toast("登录成功");
				document.querySelector(".mui-title-number").textContent = state.user.real_name;
			}else{
				mui.back();
			}
				
			document.getElementById('logout').addEventListener('tap', function() {
				mui.back();
			}, false);
			
			var self = plus.webview.currentWebview();
			for(var i = 0; i < subpages.length; i++) {
				var temp = {};
				var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
				if(i > 0) {
					sub.hide();
				} else {
					temp[subpages[i]] = "true";
					mui.extend(aniShow, temp);
				}
				self.append(sub);
			}
		});
		//当前激活选项
		var activeTab = subpages[0];
		localStorage.setItem("isTime","1");

		var title = document.getElementById("title");
		//选项卡点击事件
		mui('.mui-bar-tab').on('tap', 'a', function(e) {
			var targetTab = this.getAttribute('href');
			if(targetTab == activeTab) {
				return;
			}
			if(targetTab == "lf_my.html"){
				document.querySelector(".head2").style.display = "block";
				document.querySelector(".head1").style.display = "none";
			}else{
				document.querySelector(".head2").style.display = "none";
				document.querySelector(".head1").style.display = "block";
			}
			
			if(targetTab == "lf_index.html"){
				localStorage.setItem("isTime","1");
			}else{
				localStorage.setItem("isTime","0");
			}
			
			//更换标题
			title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
			//显示目标选项卡
			//若为iOS平台或非首次显示，则直接显示
			if(mui.os.ios || aniShow[targetTab]) {
				plus.webview.show(targetTab);
			} else {
				//否则，使用fade-in动画，且保存变量
				var temp = {};
				temp[targetTab] = "true";
				mui.extend(aniShow, temp);
				plus.webview.show(targetTab, "fade-in", 300);
			}
			
			var subWebview = plus.webview.getWebviewById(targetTab);
			var sid = subWebview.id.toString();
			var model = sid.replace(".html","").replace("lf_","");
			mui.fire(subWebview, model+'Event', {})
			
			
			//隐藏当前;
			plus.webview.hide(activeTab);
			//更改当前活跃的选项卡
			activeTab = targetTab;
		});
		
		mui(".head1").on('tap', '.icon-index-Help', function(e) {
			mui.openWindow('page/help/help.html');
		});
		mui(".mui-bar").on('tap', '.icon-index-ervice', function(e) {
			mui.openWindow('page/help/customer.html');
		});
