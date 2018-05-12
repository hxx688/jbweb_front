/**
 * 参考文档：http://ask.dcloud.net.cn/article/431
 * 升级文件为JSON格式数据，如下：
 * 
 * 需升级
 {
	"status":1,
	"version": "2.6.0",
	"title": "Hello MUI版本更新",
	"note": "修复“选项卡+下拉刷新”示例中，某个选项卡滚动到底时，会触发所有选项卡上拉加载事件的bug；\n修复Android4.4.4版本部分手机上，软键盘弹出时影响图片轮播组件，导致自动轮播停止的bug；",
	"url": "http://www.dcloud.io/hellomui/HelloMUI.apk"
}
*
* 无需升级
{"status":0}
 */
var server = API.API_ROOT + "/static/check.json"; //获取升级描述文件服务器地址

function update() {
	mui.getJSON(server, {
		"appid": plus.runtime.appid,
		"version": plus.runtime.version,
		"imei": plus.device.imei
	}, function(data) {
		var curVer = plus.runtime.version,
			inf = data[plus.os.name];
		if(inf) {
			var srvVer = inf.version;
			if(compareVersion(curVer, srvVer)) {
				plus.nativeUI.confirm(inf.note, function(event) {
					if(0 == event.index) {
						plus.runtime.openURL(inf.url);
					}
				}, data.title, ["立即更新", "取　　消"]);
			}
		}
	});
}

/**
 * 比较版本大小，如果新版本nv大于旧版本ov则返回true，否则返回false
 * @param {String} ov
 * @param {String} nv
 * @return {Boolean} 
 */
function compareVersion(ov, nv) {
	if(!ov || !nv || ov == "" || nv == "") {
		return false;
	}
	var b = false,
		ova = ov.split(".", 4),
		nva = nv.split(".", 4);
	for(var i = 0; i < ova.length && i < nva.length; i++) {
		var so = ova[i],
			no = parseInt(so),
			sn = nva[i],
			nn = parseInt(sn);
		if(nn > no || sn.length > so.length) {
			return true;
		} else if(nn < no) {
			return false;
		}
	}
	if(nva.length > ova.length && 0 == nv.indexOf(ov)) {
		return true;
	}
}

mui.os.plus && !mui.os.stream && mui.plusReady(update);