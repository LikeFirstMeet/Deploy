/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

addLoadEvent(pageLoad);
function pageLoad(){
   setDivHeight("div_left", "div_right");
}


/*******************************************************************************************
* URL:         http://www.wyzxsx.com                                                       *                                                             *
* Time:        2012-04-12 11:20:00                                                         *
* Description: Zoom font,Copy,Download,AddFavorite,SetHome                                 *                                                                                                                                                   *
********************************************************************************************/

//文章专用JavaScript

//设置控制标签的ID
var context=document.getElementById('textcontent');
//设置控制标签
var tgs = new Array( 'div','p','font','span','ul','li','ol','dl','dt');
//字体大小列表
var szs = new Array( '12px','14px','16px','18px','20px','22px','24px' );
var startSz = 1;
function changeFont( trgt,inc ) {
        var divLeft = document.getElementById("div_left");
        divLeft.style.height = 'auto';
	if (!document.getElementById){
		return;
	}
	var cEl = null,sz = startSz,i,j,cTags;
	sz += inc;
	if ( sz < 0 ){
		sz = 0;
	}
	var len=szs.length-1;
	if ( sz > len ){
		sz = len;
	}
	startSz = sz;
	if (!(cEl=document.getElementById(trgt))){
		cEl = document.getElementsByTagName( trgt )[ 0 ];
		cEl.style.fontSize = szs[ sz ];
	}
	for ( i = 0 ; i < tgs.length ; i++ ) {
		cTags = cEl.getElementsByTagName( tgs[ i ] );
		for ( j = 0 ; j < cTags.length ; j++ ){
			cTags[ j ].style.fontSize = szs[ sz ];
		}
	}
}

//复制到剪切版
//Example: <a href="#" onclick="copyToClipboard()">复制本文</a>
function copyToClipboard() {
	//文章标题
	var txt_title = document.getElementById('txt_title').innerHTML;
	//文章相关信息
	var txt_info = document.getElementById('txt_info').innerHTML;
	txt_info = txt_info.replace(/<script[^>]*?>[\s\S]*?<\/script>/ig,''); //替换script
	txt_info = txt_info.replace(/<\/?[^>]*>/g,''); //替换html标签
	txt_info = txt_info.replace(/&nbsp;/ig,' ');//替换实体空格
	//文章内容
	var txt_body = document.getElementById('textcontent').innerHTML;
	txt_body = txt_body.replace(/<script[^>]*?>[\s\S]*?<\/script>/ig,''); //替换script
	txt_body = txt_body.replace(/<\/?[^>]*>/g,''); //替换html标签
	txt_body = txt_body.replace(/\t/g,'');//替换tab
	//txt_body = txt_body.replace(/　/g,'');//替换全角空格
	txt_body = txt_body.replace(/&nbsp;/ig,' ');//替换实体空格
	//txt_title = txt_title.replace(/&nbsp;/ig,' ');//替换标题中的实体空格
	var txt = txt_title + '\n\r' + txt_info + '\n\r' + txt_body;
	if(window.clipboardData) {   
		window.clipboardData.clearData();   
		window.clipboardData.setData("Text", txt);   
		alert("文章已复制！\r\n提示：按 Ctrl+v 可以将上面信息粘贴到您指定的位置，如博客或文字处理软件。\r\n\按空格键关闭本提示");  
	} else if(navigator.userAgent.indexOf("Opera") != -1) {   
		window.location = txt;   
	} else if (window.netscape) {   
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");   
		} catch (e) {   
			alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将 'signed.applets.codebase_principal_support'设置为'true'");   
		}   
		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);   
		if (!clip)   
			return;   
		var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);   
		if (!trans)   
			return;   
		trans.addDataFlavor('text/unicode');   
		var str = new Object();   
		var len = new Object();   
		var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);   
		var copytext = txt;   
		str.data = copytext;   
		trans.setTransferData("text/unicode",str,copytext.length*2);   
		var clipid = Components.interfaces.nsIClipboard;   
		if (!clip)   
			return false;   
		clip.setData(trans,null,clipid.kGlobalClipboard);   
		alert("文章已复制！\r\n提示：按 Ctrl+v 可以将上面信息粘贴到您指定的位置，如博客或文字处理软件。\r\n\按空格键关闭本提示");  
	}   
}

//下载
//Example: <a href="#" onclick="geting()">下载本文</a>
function downText(){
	//文章标题
	var txt_title = document.getElementById('txt_title').innerHTML;
	//文章相关信息
	var txt_info = document.getElementById('txt_info').innerHTML;
	//var txt_name = txt_info + ":" + txt_title;
	var txt_name = txt_title;
	//文章作者
	txt_info = "作者："+txt_info;
	//文章内容
	var txt_body = document.getElementById('textcontent').innerHTML;
	txt_body = txt_body.replace(/<script[^>]*?>[\s\S]*?<\/script>/ig,''); //替换script
	txt_body = txt_body.replace(/<\/?[^>]*>/g,''); //替换html标签
	txt_body = txt_body.replace(/\t/g,'');//替换tab
	//txt_body = txt_body.replace(/　/g,'');//替换全角空格
	txt_body = txt_body.replace(/&nbsp;/ig,' ');//替换空格实体
	//txt_title = txt_title.replace(/&nbsp;/ig,' ');//替换空格实体
	txt_name = txt_name.replace(/&nbsp;/ig,' ');
	txt_name = txt_name.replace(/<script[^>]*?>[\s\S]*?<\/script>/ig,''); //替换script
	txt_name = txt_name.replace(/<\/?[^>]*>/g,''); //替换html标签
	txt_name = txt_name.replace(/\t/g,'');//替换tab
	txt_name = txt_name.replace(/　/g,'');//替换全角空格
	txt_name = txt_name.replace(/&nbsp;/ig,' ');//替换空格实体
	var txt = txt_title + '\n\r' + txt_info + '\n\r' + txt_body;
	txt = txt.replace(/&nbsp;/ig,' ');
	txt = txt.replace(/<script[^>]*?>[\s\S]*?<\/script>/ig,''); //替换script
	txt = txt.replace(/<\/?[^>]*>/g,''); //替换html标签
	txt = txt.replace(/\t/g,'');//替换tab
	txt = txt.replace(/　/g,'');//替换全角空格
	txt = txt.replace(/&nbsp;/ig,' ');//替换空格实体

	var submitForm = document.createElement("FORM");
	document.body.appendChild(submitForm);
	submitForm.method = "POST";
	//下载文本的链接
	submitForm.action='http://z.wyzxsx.com/DougDownload.php';
	var article = document.createElement("input");
	article.setAttribute("name",'a');
	article.setAttribute("type","hidden");
	article.setAttribute("value",txt);
	submitForm.appendChild(article);
		
	var filename = document.createElement("input");
	filename.setAttribute("name",'filename');
	filename.setAttribute("type","hidden");
	filename.setAttribute("value",txt_name);
	submitForm.appendChild(filename);
	submitForm.submit();
};
		
//添加至收藏
//Example:	<a href="#" onclick="AddFavorite(window.location,document.title)">加入收藏</a>
function AddFavorite(sURL, sTitle){    
	try{
		window.external.addFavorite(sURL, sTitle);
	}
	catch (e){
		try{
			window.sidebar.addPanel(sTitle, sURL, "");
		}catch (e){
			alert("加入收藏失败，请使用Ctrl+D进行添加");
			}    
	}    
}

//设置首页
//Example:	<a  href="#" onclick="SetHome(this,window.location)">首页</a>
function SetHome(obj,vrl){
	try{
		obj.style.behavior='url(#default#homepage)';obj.setHomePage(vrl);    
  }catch(e){
  	if(window.netscape){
      	try {
      		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
      	}catch(e){
      		alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入\"about:config\"并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");    
           }
           var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);    
           prefs.setCharPref('browser.startup.homepage',vrl);    
     }    
  }    
} 

/*
        分享工具 HRshare
        @DOM
                <div>
                        <a class="hr-share-xiaoyou"></a>
                        <a class="hr-share-115"></a>
                        <a class="hr-share-tsina"></a>
                        <a class="hr-share-tqq"></a>
                        <a class="hr-share-more"></a>
                </div>
        @Usage
                $('div').HRshare(options);
        @options
                size		:16,	//图标尺寸，目前可选16和32
                hasText		:true	//是否显示文字
*/
	$.fn.HRshare = function(options){
		var options = $.extend({}, {
			size	:16,
			hasText	:true
		}, options);
		var shareico = {
			"tqq"		:"http://v.t.qq.com/share/share.php?title={title}&url={url}&appkey=118cd1d635c44eab9a4840b2fbf8b0fb",
			"tsina"		:"http://service.weibo.com/share/share.php?title={title}&url={url}&source=bookmark&appkey=2992571369",
			"qzone"		:"http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}",
			"renren"	:"http://share.renren.com/share/buttonshare.do?link={url}&title={title}",
			"baidu"		:"http://cang.baidu.com/do/add?it={title}&iu={url}&fr=ien#nw=1",
			"115"		:"http://sc.115.com/add?url={url}&title={title}",
			"tsohu"		:"http://t.sohu.com/third/post.jsp?url={url}&title={title}&content=utf-8",
			"taobao"	:"http://share.jianghu.taobao.com/share/addShare.htm?url={url}",
			"xiaoyou"	:"http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?to=pengyou&url={url}",
			"hi"		:"http://apps.hi.baidu.com/share/?url={url}&title={title}",
			"fanfou"	:"http://fanfou.com/sharer?u={url}&t={title}",
			"sohubai"	:"http://bai.sohu.com/share/blank/add.do?link={url}",
			"feixin"	:"http://space3.feixin.10086.cn/api/share?title={title}&url={url}",
			"youshi"	:"http://www.ushi.cn/feedShare/feedShare!sharetomicroblog.jhtml?type=button&loginflag=share&title={title}&url={url}",
			"tianya"	:"http://share.tianya.cn/openapp/restpage/activity/appendDiv.jsp?app_id=jiathis&ccTitle={title}&ccUrl={url}&jtss=tianya&ccBody=",
			"msn"		:"http://profile.live.com/P.mvc#!/badge?url={url}&screenshot=",
			"douban"	:"http://shuo.douban.com/!service/share?image=&href={url}&name={title}",
			"twangyi"	:"http://t.163.com/article/user/checkLogin.do?source={title}&info={title}+{url}&images=",
			"mop"		:"http://tk.mop.com/api/post.htm?url={url}&title={title}"
		};
		var shareiconame = {
			"tqq"		:"腾讯微博",
			"tsina"		:"新浪微博",
			"qzone"		:"QQ空间",
			"renren"	:"人人网",
			"baidu"		:"百度收藏",
			"115"		:"115",
			"tsohu"		:"搜狐微博",
			"taobao"	:"淘江湖",
			"xiaoyou"	:"腾讯朋友",
			"hi"		:"百度空间",
			"fanfou"	:"饭否",
			"sohubai"	:"搜狐白社会",
			"feixin"	:"飞信",
			"tianya"	:"天涯社区",
			"youshi"	:"优士网",
			"msn"		:"MSN",
			"douban"	:"豆瓣",
			"twangyi"	:"网易微博",
			"mop"		:"猫扑推客"
		};
		this.each(function(){
			$(this).addClass("hr-share-"+options.size);
			var title = document.title;
			var url = window.location.href;
			function eFunction(str){
				return function(){
					window.open(formatmodel(shareico[str],{title:title, url:url}));
				}
			}
			for(si in shareico){
				$(".hr-share-"+si).die('click').live('click',eFunction(si)).attr("title","分享到"+shareiconame[si]);
				if(options.hasText){
					$(".hr-share-"+si).text(shareiconame[si]);
				}
				$(".hr-share-more-panel-"+si).die('click').live('click',eFunction(si));
			}
			
			//更多
			$(".hr-share-more").live("click",function(){
				if(!$(".HRshare-bg").length){
					if($.browser.msie && $.browser.version == "6.0"){
						//ie6无法遮住select，则只能将其隐藏
						$("select:visible").addClass("hr-share-select-hidden");
						//ie6不支持position:fixed
						$("body").append("<div class='HRshare-bg' style='position:absolute;left:0;top:0;width:"+$(window).width()+"px;height:"+$(window).height()+"px;display:none;z-index:9998;background-color:#000;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=50);opacity:0.5;'></div>");
					}else{
						$("body").append("<div class='HRshare-bg' style='position:fixed;top:0;left:0;width:100%;height:100%;display:none;z-index:9998;  background-color:#000;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=50);opacity:0.5;'></div>");
					}
				}
				$(".HRshare-bg").fadeIn('fast');
				
				if(!$(".hr-share-more-panel").length){
					var _left = ($(window).width()-270)/2;
					var _top = ($(window).height()-300)/3;
					if($.browser.msie && $.browser.version == "6.0"){
						var _sharepanel = '<div class="hr-share-more-panel" style="position:absolute;z-index:9999;left:expression(eval(document.documentElement.scrollLeft)+'+_left+');top:expression(eval(document.documentElement.scrollTop)+'+_top+')">';
					}else{
						var _sharepanel = '<div class="hr-share-more-panel" style="position:fixed;z-index:9999;top:'+_top+'px;left:'+_left+'px">';
					}
					_sharepanel += '<div class="hr-share-more-panel-title"><a href="#close" title="关闭">×</a><span>分享到各大网站</span></div><div class="hr-share-more-panel-list">';
					for(si in shareiconame){
						_sharepanel += '<a class="hr-share-more-panel-'+si+'">'+shareiconame[si]+'</a>';
					}
					_sharepanel += '</div><div class="hr-share-more-panel-copyright"><a href="http://www.wyzxsx.com" target="_blank">乌有之乡</a></div></div>';
					$("body").append(_sharepanel);
				}
				$(".hr-share-more-panel").fadeIn('fast');
			});
			$(".HRshare-bg").live("click",function(){
				$(".hr-share-more-panel").fadeOut('fast');
				$(".HRshare-bg").fadeOut('fast');
			});
			$(".hr-share-more-panel-title a").live("click",function(){
				$(".hr-share-more-panel").fadeOut('fast');
				$(".HRshare-bg").fadeOut('fast');
			});
			$(window).bind('resize',function(){
				var _left = ($(window).width()-270)/2;
				var _top = ($(window).height()-300)/3;
				$(".hr-share-more-panel").css({"left":_left,"top":_top});
			});
		});
	};
	
	function formatmodel(str,model){
		for(var k in model){
			var re = new RegExp("{"+k+"}","g");
			str = str.replace(re,model[k]);
		}
		return str;
	}

