	var myChart;
	var date = [];	
	var data = [];
	var data0 = [];
	var data1 = [];
	
	$(function(){
		myChart = echarts.init(document.getElementById('main'));
		var wh = document.documentElement.clientWidth || document.body.clientWidth;
		wh = wh + 25;
		$("#main").attr("style","width:"+wh+"px;");
		$("#main2").attr("style","width:"+wh+"px;");
		$("#main3").attr("style","width:"+wh+"px;");
		$("#main4").attr("style","width:"+wh+"px;");
		$("#main5").attr("style","width:"+wh+"px;");
		$("#main7").attr("style","width:"+wh+"px;");
	})
	
	mui.init({
		swipeBack:true //启用右滑关闭功能
	});
	mui.init({
		beforeback: function() {
			var wobj = plus.webview.getWebviewById("lf_index.html");
        	mui.fire(wobj,'indexEvent');
			localStorage.setItem("isTime","1");
			return true;
		}
	});
	var pid = 0;
	var code = 0;
	mui.plusReady(function() {

		initLine();
		
		var self = plus.webview.currentWebview();
		pid = self.pid;
		code = self.code;
						
		var obj = {type:"0",code:code};
		app.ajax("lf_kline",obj, function(param) {
				initDayLine(param.day);
				initWeekLine(param.week);
		});

		$(".select-none").bind("change",function(e){
			$(".mui-active").removeClass("mui-active");
			if("item-3"==this.value){			
				$("#item3").addClass("mui-active");
			}
			if("item-2"==this.value){
				$("#item2").addClass("mui-active");
			}
		});
		
		initview();
		
		localStorage.setItem("isTime","2");
		document.addEventListener('tradeEvent', function(event) {
			loadProduct();
			initMinuts();
		});
		loadProduct();
		initMinuts();
	});
	
	function initMinuts(){
		var obj = {type:"0",code:code};
		app.ajax("lf_kMinutesline",obj, function(param) {
			initMinutesLine(param.minutes);
			initThirtyMinutesLine(param.thirtyminutes);
			initHourLine(param.hour);
		});
		var isTime = localStorage.getItem("isTime");
		if(isTime==2){
			timer = setTimeout("initMinuts()",10000);
		}else{
			window.clearTimeout(timer);
		}
	}
	
	function　initview(){
		var obj = {pid:pid,code:code};

		app.ajax("lf_productline",obj, function(param) {
			var productSale = param.productSales;
			var product = param.product;
			document.querySelector(".p-title").textContent = product.product_name;

			var ul = document.querySelector(".trade-buy");
			ul.innerHTML = "";
			for(var i=0;i<productSale.length;i++){
				var ps = productSale[i];
				li = document.createElement('li');
				if(i<param.length-1){
					li.classList.add("trade-buy-border-bottom");
				}
				li.id = ps.id;
				li.classList.add("product-buy");
				var btnHmtl = 	'<a class="trade-buy-up"><span class="iconfont icon-up"></span><span class="trade-buy-button-info">买涨</span></a>'+
				                '<a class="trade-buy-down"><span class="iconfont icon-down"></span><span class="trade-buy-button-info">买跌</span></a>'+
				                '<div class="trade-buy-number"><span class="buy-count">'+ps.price+'</span><span class="trade-buy-unit">&nbsp;元/每手</span></div>'+
				                '<span class="trade-buy-explain">波动盈亏：'+ps.yinkui+'元</span>';	     
				li.innerHTML = btnHmtl;
				ul.appendChild(li);
			}
			
			mui(".product-buy").on('tap','.trade-buy-up', function(e) {
				localStorage.setItem("isTime","0");
				var psid = this.parentNode.id;
				mui.openWindow({url:'product-buy.html',extras: {pid: pid,psid: psid,buytype:"1",code:code}});
			});
			mui(".product-buy").on('tap','.trade-buy-down', function(e) {
				localStorage.setItem("isTime","0");
				var psid = this.parentNode.id;
				mui.openWindow({url:"product-buy.html",extras: {pid: pid,psid: psid,buytype:"2",code:code}});
			});				
		});
		
	}
	
	var timer = null;
	function loadProduct(){
		var obj = {id:pid,code:code};
		app.ajax("lf_productTime",obj, function(param) {
			if(param.json){
				var product_sale = eval("("+param.json+")");
				if(product_sale){
					document.querySelector(".low-price").textContent = product_sale.Low;
					document.querySelector(".high-price").textContent = product_sale.High;
					document.querySelector(".now-price").textContent = product_sale.NewPrice;
					document.querySelector(".open-price").textContent = product_sale.Open;
				}
			}
		
			if(param){				
				myChart.setOption({
					xAxis:{
	                    data:param.xAxis,
		        		axisLabel : {
		        			interval :parseInt(param.xAxis.length/4),
		                    formatter : function(params){
		                        var time = params.split(" ")[1];
		                        var hh = time.split(":");
		                        return hh[0]+":"+hh[1];
		                    }
		               }
	                },
	                series:[
	                    {
	                        name:"价格",
	                        data:param.yAxis
	                    }
	                ]
	           	})
			}

			var isTime = localStorage.getItem("isTime");
			if(isTime==2){
				timer = setTimeout("loadProduct()",1000);
			}else{
				window.clearTimeout(timer);
			}
		});
	}

	function initLine(){
		var width = document.documentElement.clientWidth || document.body.clientWidth;
		var align = width/2;
		option = {
		    tooltip: {
		        trigger: 'axis',
		        position: function (pt) {
		        	var x = pt[0];
		        	if(x>align){
		        		x = x - 138;
		        	}
		            return [x, '10%'];
		        }
		    },
		    xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data: date
		    },
		    yAxis: {
		        type: 'value',
		        boundaryGap:['10%','10%'],		       
		        scale: true
		    },
		   	grid: {
			        x:50,
			        x2:20,
			        y:10
			    },
		    series: [
		        {
		            name:'实时数据',
		            type:'line',
		            smooth:true,
		            symbol: 'none',
		            sampling: 'average',
		            itemStyle: {
		                normal: {
		                    color: 'rgb(71,123,243)'
		                }
		            },
		            areaStyle: {
		                normal: {
		                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		                        offset: 0,
		                        color: 'rgb(194,238,254)'
		                    }, {
		                        offset: 1,
		                        color: 'rgb(181,206,254)'
		                    }])
		                }
		            },
		            data: data
		        }
		    ]
		};
		myChart.setOption(option);
	}
	
	function initDayLine(data_json){
		var wh = document.documentElement.clientWidth || document.body.clientWidth;
		var dayChart = echarts.init(document.getElementById('main2'));
		var data0 = [];
		var upColor = '#ec0000';
		var upBorderColor = '#8A0000';
		var downColor = '#00da3c';
		var downBorderColor = '#008F28';
		
		// 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
		if(data_json){
			var max = data_json.length -1;
			for(var i=max;i>0;i--){
				var obj = data_json[i];
				var json_date = [];
				json_date.push(obj["Date"]);
				json_date.push(obj["Open"]);
				json_date.push(obj["Close"]);
				json_date.push(obj["Low"]);
				json_date.push(obj["High"]);
				data0.push(json_date);
			}
			data0 = splitData(data0);
		}else{
			data0 = [0];
		}
		var len = 4;
		if(data0.categoryData){
			len = data0.categoryData.length/4;
		}
		option = {
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'cross'
		        },
		        formatter: function (params) {
		            var res = params[0].name;
		            res += '<br/>  开盘 : ' + params[0].value[1] + '  最高 : ' + params[0].value[4];
		            res += '<br/>  收盘 : ' + params[0].value[2] + '  最低 : ' + params[0].value[3];
		            return res;
       			}
		    },
		   	grid: {
			        x:50,
			        x2:40,
			        y:10
			    },
		    xAxis: {
		        type: 'category',
		        data: data0.categoryData,
		        boundaryGap : false,
		        interval :len,
		        axisLabel : {
                    formatter : function(params){
                        var param = params.split("-");
                        return param[1]+"-"+param[2];
                    }
                }
		    },
		    yAxis: {
		        scale: true,
		        splitArea: {
		            show: true
		        }
		    },
		    series: [
		        {
		            name: '日K',
		            type: 'candlestick',
		            data: data0.values,
		            itemStyle: {
		                normal: {
		                    color: upColor,
		                    color0: downColor,
		                    borderColor: upBorderColor,
		                    borderColor0: downBorderColor
		                }
		            }
		        }
		    ]
		};

		dayChart.setOption(option);
	}
	
	function initMinutesLine(data_json){
		var wh = document.documentElement.clientWidth || document.body.clientWidth;
		var dayChart = echarts.init(document.getElementById('main4'));
		var data1 = [];
		var upColor = '#ec0000';
		var upBorderColor = '#8A0000';
		var downColor = '#00da3c';
		var downBorderColor = '#008F28';
		// 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
		if(data_json){
			var max = data_json.length -1;
			for(var i=max;i>0;i--){
				var obj = data_json[i];
				var json_date = [];
				json_date.push(obj["Date"]);
				json_date.push(obj["Open"]);
				json_date.push(obj["Close"]);
				json_date.push(obj["Low"]);
				json_date.push(obj["High"]);
				data1.push(json_date);
			}
			data1 = splitData(data1);
		}else{
			data1 = [0];
		}
		
		var len = 4;
		if(data1.categoryData){
			len = data1.categoryData.length/4;
		}
		option = {
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'cross'
		        },
		        formatter: function (params) {
		            var res = params[0].name;
		            res += '<br/>  开盘 : ' + params[0].value[1] + '  最高 : ' + params[0].value[4];
		            res += '<br/>  收盘 : ' + params[0].value[2] + '  最低 : ' + params[0].value[3];
		            return res;
       			}
		    },
		   	grid: {
			        x:50,
			        x2:40,
			        y:10
			    },
		    xAxis: {
		        type: 'category',
		        data: data1.categoryData,
		        boundaryGap : false,
		        interval :len,
		        axisLabel : {
                    formatter : function(params){
                        var param = params.split(" ");
                        var param2 = param[0].split("-");
                        var param3 = param[1].split(":");;
                        var str = param3[0]+":"+param3[1]+"\n"+param2[1]+"-"+param2[2];
                        return str;
                    }
                }
		    },
		    yAxis: {
		        scale: true,
		        splitArea: {
		            show: true
		        }
		    },
		    series: [
		        {
		            name: '5分钟',
		            type: 'candlestick',
		            data: data1.values,
		            itemStyle: {
		                normal: {
		                    color: upColor,
		                    color0: downColor,
		                    borderColor: upBorderColor,
		                    borderColor0: downBorderColor
		                }
		            }
		        }
		    ]
		};

		dayChart.setOption(option);
	}
	
	function initHourLine(data_json){
		var wh = document.documentElement.clientWidth || document.body.clientWidth;
		var dayChart = echarts.init(document.getElementById('main7'));
		var data1 = [];
		var upColor = '#ec0000';
		var upBorderColor = '#8A0000';
		var downColor = '#00da3c';
		var downBorderColor = '#008F28';
		// 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
		if(data_json){
			var max = data_json.length -1;
			for(var i=max;i>0;i--){
				var obj = data_json[i];
				var json_date = [];
				json_date.push(obj["Date"]);
				json_date.push(obj["Open"]);
				json_date.push(obj["Close"]);
				json_date.push(obj["Low"]);
				json_date.push(obj["High"]);
				data1.push(json_date);
			}
			data1 = splitData(data1);
		}else{
			data1 = [0];
		}
		
		var len = 4;
		if(data1.categoryData){
			len = data1.categoryData.length/4;
		}
		option = {
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'cross'
		        },
		        formatter: function (params) {
		            var res = params[0].name;
		            res += '<br/>  开盘 : ' + params[0].value[1] + '  最高 : ' + params[0].value[4];
		            res += '<br/>  收盘 : ' + params[0].value[2] + '  最低 : ' + params[0].value[3];
		            return res;
       			}
		    },
		   	grid: {
			        x:50,
			        x2:40,
			        y:10
			    },
		    xAxis: {
		        type: 'category',
		        data: data1.categoryData,
		        boundaryGap : false,
		        interval :len,
		        axisLabel : {
                    formatter : function(params){
                        var param = params.split(" ");
                        var param2 = param[0].split("-");
                        var param3 = param[1].split(":");;
                        var str = param3[0]+":"+param3[1]+"\n"+param2[1]+"-"+param2[2];
                        return str;
                    }
                }
		    },
		    yAxis: {
		        scale: true,
		        splitArea: {
		            show: true
		        }
		    },
		    series: [
		        {
		            name: '1小时',
		            type: 'candlestick',
		            data: data1.values,
		            itemStyle: {
		                normal: {
		                    color: upColor,
		                    color0: downColor,
		                    borderColor: upBorderColor,
		                    borderColor0: downBorderColor
		                }
		            }
		        }
		    ]
		};

		dayChart.setOption(option);
	}
	
	function initThirtyMinutesLine(data_json){
		var wh = document.documentElement.clientWidth || document.body.clientWidth;
		var dayChart = echarts.init(document.getElementById('main5'));
		var data1 = [];
		var upColor = '#ec0000';
		var upBorderColor = '#8A0000';
		var downColor = '#00da3c';
		var downBorderColor = '#008F28';
		// 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
		if(data_json){
			var max = data_json.length -1;
			for(var i=max;i>0;i--){
				var obj = data_json[i];
				var json_date = [];
				json_date.push(obj["Date"]);
				json_date.push(obj["Open"]);
				json_date.push(obj["Close"]);
				json_date.push(obj["Low"]);
				json_date.push(obj["High"]);
				data1.push(json_date);
			}
			data1 = splitData(data1);
		}else{
			data1 = [0];
		}
		
		var len = 4;
		if(data1.categoryData){
			len = data1.categoryData.length/4;
		}
		option = {
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'cross'
		        },
		        formatter: function (params) {
		            var res = params[0].name;
		            res += '<br/>  开盘 : ' + params[0].value[1] + '  最高 : ' + params[0].value[4];
		            res += '<br/>  收盘 : ' + params[0].value[2] + '  最低 : ' + params[0].value[3];
		            return res;
       			}
		    },
		   	grid: {
			        x:50,
			        x2:40,
			        y:10
			    },
		    xAxis: {
		        type: 'category',
		        data: data1.categoryData,
		        boundaryGap : false,
		        interval :len,
		        axisLabel : {
                    formatter : function(params){
                        var param = params.split(" ");
                        var param2 = param[0].split("-");
                        var param3 = param[1].split(":");;
                        var str = param3[0]+":"+param3[1]+"\n"+param2[1]+"-"+param2[2];
                        return str;
                    }
                }
		    },
		    yAxis: {
		        scale: true,
		        splitArea: {
		            show: true
		        }
		    },
		    series: [
		        {
		            name: '30分钟',
		            type: 'candlestick',
		            data: data1.values,
		            itemStyle: {
		                normal: {
		                    color: upColor,
		                    color0: downColor,
		                    borderColor: upBorderColor,
		                    borderColor0: downBorderColor
		                }
		            }
		        }
		    ]
		};

		dayChart.setOption(option);
	}
	
	function initWeekLine(data_json){
		var wh = document.documentElement.clientWidth || document.body.clientWidth;
		var weekChart = echarts.init(document.getElementById('main3'));
		var data2 = [];
		var upColor = '#ec0000';
		var upBorderColor = '#8A0000';
		var downColor = '#00da3c';
		var downBorderColor = '#008F28';
		// 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
		if(data_json){
			var max = data_json.length -1;
			for(var i=max;i>0;i--){
				var obj = data_json[i];
				var json_date = [];
				json_date.push(obj["Date"]);
				json_date.push(obj["Open"]);
				json_date.push(obj["Close"]);
				json_date.push(obj["Low"]);
				json_date.push(obj["High"]);
				data2.push(json_date);
			}
			data2 = splitData(data2);
		}else{
			data2 = [0];
		}

		option = {
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'cross'
		        },
		        formatter: function (params) {
		            var res = params[0].name;
		            res += '<br/>  开盘 : ' + params[0].value[1] + '  最高 : ' + params[0].value[4];
		            res += '<br/>  收盘 : ' + params[0].value[2] + '  最低 : ' + params[0].value[3];
		            return res;
       			}
		    },
		 	grid: {
		        x:50,
		        x2:40,
		        y:10
		    },
		    xAxis: {
		        type: 'category',
		        data: data2.categoryData,
		        scale: true,
		        boundaryGap : false,
		        axisLine: {onZero: false},
		        splitLine: {show: false},
		        splitNumber: 20,
		        min: 'dataMin',
		        max: 'dataMax',
		        axisLabel : {
                    formatter : function(params){
                        var param = params.split("-");
                        return param[1]+"-"+param[2];
                    }
                }
		    },
		    yAxis: {
		        scale: true,
		        splitArea: {
		            show: true
		        }
		    },
		    series: [
		        {
		            name: '周K',
		            type: 'candlestick',
		            data: data2.values,
		            itemStyle: {
		                normal: {
		                    color: upColor,
		                    color0: downColor,
		                    borderColor: upBorderColor,
		                    borderColor0: downBorderColor
		                }
		            }
		        }
		    ]
		};
		weekChart.setOption(option);
	}

	function splitData(rawData) {
	    var categoryData = [];
	    var values = []
	    for (var i = 0; i < rawData.length; i++) {
	        categoryData.push(rawData[i].splice(0, 1)[0]);
	        values.push(rawData[i])
	    }
	    return {
	        categoryData: categoryData,
	        values: values
	    };
	}


