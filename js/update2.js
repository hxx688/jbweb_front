var wgtVer=null;
var inf;
function plusReady(){
    // 获取本地应用资源版本号
    plus.runtime.getProperty(plus.runtime.appid,function(inf){
        wgtVer=inf.version;
        checkUpdate();
    });
}
if(window.plus){
    plusReady();
}else{
    document.addEventListener('plusready',plusReady,false);
}

// 检测更新
var checkUrl=API.API_ROOT ; //+ "/static/app/check.json?time="+new Date().getTime();
function checkUpdate() {
	mui.getJSON(checkUrl, {
		"appid": plus.runtime.appid,
		"version": plus.runtime.version,
		"imei": plus.device.imei
	}, function(data) {	
		var curVer = wgtVer,inf = data[plus.os.name];
		if(inf) {
			var srvVer = inf.version;
			var appVer = API.API_VERSION;
				document.getElementById("version").innerHTML= curVer+"|"+srvVer;
			if(compareVersion(curVer, srvVer)) {
				downWgt(inf.url);
			}
		}else{
			mui.toast("校验版本失败");
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

function downWgt(url){
    plus.nativeUI.showWaiting("正在更新，请稍候...");
    wgtUrl = API.API_ROOT + "/"+url;
    plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
        if ( status == 200 ) { 
            installWgt(d.filename); // 安装wgt包
        } else {
            plus.nativeUI.alert("下载失败！");
            openUrl();
        }
        plus.nativeUI.closeWaiting();
    }).start();
}

// 更新应用资源
function installWgt(path){
    plus.runtime.install(path,{},function(){
        plus.nativeUI.closeWaiting();
        plus.nativeUI.alert("更新完成！",function(){
            plus.runtime.restart();
        });
    },function(e){
        plus.nativeUI.closeWaiting();
        plus.nativeUI.alert("安装文件失败["+e.code+"]："+e.message);
      	openUrl();
    });
}

function openUrl(){
	plus.nativeUI.toast("更新失败，请重新下载应用");
	var apkUrl = API.API_ROOT + "/"+ inf.apkUrl;
	plus.runtime.openURL(apkUrl);
}
