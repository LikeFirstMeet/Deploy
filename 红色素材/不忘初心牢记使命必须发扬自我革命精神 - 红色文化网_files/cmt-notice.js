!function(){function e(e){return"[object Function]"===Object.prototype.toString.call(e)}function t(t,i,n){if(s[t])throw new Error("Module "+t+" has been defined already.");e(i)&&(n=i),s[t]={factory:n,inited:!1,exports:null}}function i(t){var i,a,o,l;if(i=s[t],a={},o={exports:{}},!e(i.factory))throw new Error("Module "+t+" has no factory.");if(l=i.factory.call(void 0,n,a,o),void 0!==l)i.exports=l;else if(o.hasOwnProperty("exports")&&"object"==typeof o.exports&&o.exports instanceof Object==!0){var c,r=!1;for(c in o.exports)o.exports.hasOwnProperty(c)&&(r=!0);r===!1?i.exports=a:i.exports=o.exports}else i.exports=o.exports;i.inited=!0}function n(e){var t;if(t=s[e],!t)throw new Error("Module "+e+" is not defined.");return t.inited===!1&&i(e),t.exports}var s={};t("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/cmt-notice.js",function(e,t,i){window.changyan.api.ready(function(t){var i=t.util.jquery,n=e("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/model.js"),s=e("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/view.js"),a=e("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/control.js");a.bindModel(n).bindView(s),i(function(e){return function(){window.setTimeout(function(){e.init()},200)}}(a));var o=e("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/readADHeight.js");i(function(e){return function(){window.setTimeout(function(){e.initPos()},5e3)}}(o)),function(e){t.event.listen("changyan:login",function(){e.update()}),t.event.listen("changyan:logout",function(){e.update()}),t.event.listen("changyan:cmt-float-bar:ready",function(){e.updateView()}),t.event.listen("changyan:cy-user-info:render-my-finish",function(){e.execViewPlan(),e.updateView()}),t.event.listen("changyan:cy-user-page:close",function(){e.disableViewPlan()})}(a)})}),t("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/model.js",function(e,t,i){i.exports={tasks:{sumBubble:{num:0,invisible:!0},userInfoDot:{invisible:!0},userMsgDot:{invisible:!0,callback:function(e){e.resetStaticElement("message")}},userTskDot:{invisible:!0,callback:function(e){e.resetStaticElement("task")}},userHstDot:{invisible:!0,callback:function(e){e.resetStaticElement("history")}},userInfoSupportBubble:{num:0,invisible:!0,callback:function(e){e.resetStaticElement("support")}},userInfoReplyBubble:{num:0,invisible:!0,callback:function(e){e.resetStaticElement("reply")}}},elements:{message:{"static":!0,type:"message",invisible:!0,data:{num:0}},support:{"static":!0,type:"support",invisible:!0,data:{num:0}},reply:{"static":!0,type:"reply",invisible:!0,data:{num:0}},hots:{"static":!0,type:"hots",invisible:!0,data:{num:0}},task:{"static":!0,type:"task",invisible:!0,data:{num:0}},history:{"static":!0,type:"history",invisible:!0,data:{num:0}}},elementPriority:["reply","hots","support","message","task","history"],hist:{},update:function(e){for(var t in e)e.hasOwnProperty(t)&&this.updateElement(t,e[t].data);this.updateTasks()},getElements:function(){return this.elements},getElement:function(e){return this.elements[e]},addElement:function(e,t,i){this.elements[i]={type:e,data:t}},updateElement:function(e,t){this.elements.hasOwnProperty(e)?(this.elements[e].data=t,this.elements[e].invisible=!t.num):this.addElement("dynamic",t,e)},resetStaticElement:function(e){this.elements[e].invisible=!0,this.elements[e].data.num=0,this.updateTasks()},resetTask:function(e,t){if(this.tasks[e]){if(t)for(var i in t)this.tasks[e][i]=t[i];else this.tasks[e].invisible=!0,this.tasks[e].num&&(this.tasks[e].num=0);this.tasks[e].callback&&this.tasks[e].callback(this),this.updateTasks()}},deleteElement:function(e){delete this.elements[e]},updateTasks:function(){var e=this.elements.message.data.num,t=this.elements.support.data.num,i=this.elements.reply.data.num,n=(this.elements.hots.data.num,this.elements.task.data.num),s=this.elements.history.data.num;this.tasks.sumBubble.num=e+t+i+n+s,this.tasks.sumBubble.invisible=0==this.tasks.sumBubble.num,this.tasks.userInfoDot.invisible=t+i==0,this.tasks.userMsgDot.invisible=0==e,this.tasks.userTskDot.invisible=0==n,this.tasks.userHstDot.invisible=0==s,this.tasks.userInfoSupportBubble.num=t,this.tasks.userInfoSupportBubble.invisible=0==t,this.tasks.userInfoReplyBubble.num=i,this.tasks.userInfoReplyBubble.invisible=0==i}}}),t("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/view.js",function(e,t,i){window.changyan.api.ready(function(t){var n=t.util.jquery,s=t.util.velocityjs;e("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/cmt-notice.css");var a={jquery:n,_template:s,containerSelector:"#SOHUCS #SOHU_MAIN",container:null,instance:null,_model:null,tasks:{userInfoDot:{type:0,hostSelector:".module-cy-user-page-mine",targetSelector:'.module-cy-user-page-mine ul.cy-tab-list li[node-type="cy-info"]'},userMsgDot:{type:0,hostSelector:".module-cy-user-page-mine",targetSelector:'.module-cy-user-page-mine ul.cy-tab-list li[node-type="cy-notice"]',callback:function(e){n.ajax({url:t.getConfig("api")+"api/3/user/clear_unread/3",dataType:"jsonp",data:{client_id:t.getFeConfig("appid")},scriptCharset:"utf-8",success:function(e,t){return function(i){i.error_code||e.callbackToModel(t)}}(this,e)})}},userTskDot:{type:0,hostSelector:".module-cy-user-page-mine",targetSelector:'.module-cy-user-page-mine ul.cy-tab-list li[node-type="cy-task"]',callback:function(e){this.callbackToModel(e)}},userHstDot:{type:0,hostSelector:".module-cy-user-page-mine",targetSelector:'.module-cy-user-page-mine ul.cy-tab-list li[node-type="cy-footprint"]',callback:function(e){this.callbackToModel(e)}},userInfoSupportBubble:{type:1,hostSelector:".module-cy-user-page-mine",targetSelector:".module-cy-user-page-mine ul.cy-my-label li:nth-child(3) div.cy-my-label-item",callback:function(e){n.ajax({url:t.getConfig("api")+"api/3/user/clear_unread/2",dataType:"jsonp",data:{client_id:t.getFeConfig("appid")},scriptCharset:"utf-8",success:function(e,t){return function(i){i.error_code||e.callbackToModel(t)}}(this,e)})}},userInfoReplyBubble:{type:1,hostSelector:".module-cy-user-page-mine",targetSelector:".module-cy-user-page-mine ul.cy-my-label li:nth-child(2) div.cy-my-label-item",callback:function(e){n.ajax({url:t.getConfig("api")+"api/3/user/clear_unread/1",dataType:"jsonp",data:{client_id:t.getFeConfig("appid")},scriptCharset:"utf-8",success:function(e,t){return function(i){i.error_code||e.callbackToModel(t)}}(this,e)})}}},elements:{message:{"static":!0,template:"你收到<i>${num}</i>条新通知",action:["openUserPage","openMessage"],callback:function(){n.ajax({url:t.getConfig("api")+"api/3/user/clear_unread/3",data:{client_id:t.getFeConfig("appid")},dataType:"jsonp",scriptCharset:"utf-8"})}},support:{"static":!0,template:"你有<i>${num}</i>条评论收到赞同",action:["openUserPage","openUserInfo","openSupport"],callback:function(){n.ajax({url:t.getConfig("api")+"api/3/user/clear_unread/2",data:{client_id:t.getFeConfig("appid")},dataType:"jsonp",scriptCharset:"utf-8"})}},reply:{"static":!0,template:"你有<i>${num}</i>条新回复",action:["openUserPage","openUserInfo","openReply"],callback:function(){n.ajax({url:t.getConfig("api")+"api/3/user/clear_unread/1",data:{client_id:t.getFeConfig("appid")},dataType:"jsonp",scriptCharset:"utf-8"})}},hots:{"static":!0,template:"本日畅言热评新鲜出炉啦！",action:["openUserPage","openHots"],callback:function(){}},task:{"static":!0,template:"你有<i>${num}</i>个任务已完成",action:["openUserPage","openTask"],callback:function(){}},history:{"static":!0,template:"你收获<i>${num}</i>个畅言足迹",action:["openUserPage","openHistory"],callback:function(){}},dynamic:{template:"",callbackToModel:function(e,t){e.deleteElement(t)}}},actions:{immediate:{openUserPage:!0},openUserPage:function(e){return n(".module-cmt-header").length?n('.module-cmt-header div[node-type="avatar"]').length?(n('.module-cmt-header div[node-type="avatar"]').trigger("click"),1):0:-1},openUserInfo:function(e){return n(".module-cy-user-page").length?n(".module-cy-user-page .module-cy-user-info").length?(n('.module-cy-user-page .cy-user-page-tab li[node-type="cy-info"]').trigger("click"),1):0:-1},openMessage:function(e){return n(".module-cy-user-page").length?n(".module-cy-user-page .module-cy-user-notice").length?(n('.module-cy-user-page .cy-user-page-tab li[node-type="cy-notice"]').trigger("click"),1):0:-1},openSupport:function(e){return n(".module-cy-user-page").length?n(".module-cy-user-page .module-cy-user-info .cy-my-page-support").length?(n(".module-cy-user-page ul.cy-my-label li:nth-child(3) div.cy-my-label-item").trigger("click"),1):0:-1},openReply:function(e){return n(".module-cy-user-page").length?n(".module-cy-user-page .module-cy-user-info .cy-my-page-reply").length?(n(".module-cy-user-page ul.cy-my-label li:nth-child(2) div.cy-my-label-item").trigger("click"),1):0:-1},openHots:function(e){return n(".module-cy-user-page").length?n(".module-cy-user-page .module-cy-user-hots").length?(n('.module-cy-user-page ul.cy-tab-list li[node-type="cy-hots"]').trigger("click"),n.ajax({url:"https://changyan.sohu.com/api/3/user/repingNoticeCle",dataType:"jsonp",success:function(){},error:function(){}}),1):0:-1},openTask:function(e){return n(".module-cy-user-page").length?n(".module-cy-user-page .module-cy-user-task").length?(n('.module-cy-user-page .cy-user-page-tab li[node-type="cy-task"]').trigger("click"),1):0:-1},openHistory:function(e){return n(".module-cy-user-page").length?n(".module-cy-user-page .module-cy-user-footprint").length?(n('.module-cy-user-page .cy-user-page-tab li[node-type="cy-footprint"]').trigger("click"),1):0:-1}},actionQueue:[],_toDoActions:!1,enableActions:function(){this._toDoActions=!0},disableActions:function(){this._toDoActions=!1},doActions:function(){function e(t,i,n){setTimeout(function(){if(!t.length)return void n.update();var s=t[0],a=i[s]();if(1==a)t.shift();else if(-1==a)return void(t.length=0);e(t,i,n)},200)}this._toDoActions&&e(this.actionQueue,this.actions,this)},_updateActionQueue:function(e){if(!e)var e=this._model;for(var t=0,i=e.elementPriority.length;i>t;t++)if(e.elements[e.elementPriority[t]].data.num>0)return void(this.actionQueue=this.elements[e.elementPriority[t]].action.slice(1));this.actionQueue=[]},bindModel:function(e){return this._model=e,this},_initTasks:function(){for(var e in this.tasks){var t=this.tasks[e];t.targetSelector&&(t.alias=e,t.host=function(){return n(this.hostSelector)},t.target=function(){return n(this.targetSelector)},t.clickPropagate||(t.clickPropagate=t.targetSelector),t.callbackToModel=function(e,t,i){if(!t)var t=this.alias;e.resetTask(t,i)},t.draw=function(e){var t=!e.num&&!e.hasOwnProperty("num"),i=this.target();if(!i||!i.length)return void setTimeout(function(e,t){return function(){var i=e.host();i&&i.length&&e.draw(t)}}(this,e),200);var s=t?"dot":"bubble";i=this.target().find(".module-cmt-notice-"+s),i.length<=0&&(i=n('<div class="module-cmt-notice-'+s+'"></div>'),i.data("alias",this.alias),this.target().append(i),this.target().css("position","relative")),i.css("display",e.invisible?"none":"inline-block"),t||i.text(e.num)})}},_initElements:function(){for(var e in this.elements){var t=this.elements[e];t["static"]&&(t.alias=e,t.callbackToModel=function(e){e.resetStaticElement(this.alias)})}},_adapt:function(e,t){return{alias:e,"static":t["static"]?"static":"dynamic",type:t.type,invisible:!!t.invisible,template:this._template.render(this.elements[t.type].template,t.data)}},_addElement:function(t,i){var s=this._template.render(e("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/item.html.js"),this._adapt(t,i));this._find("ul.nt-list").append(n(s))},_updateElementData:function(e,t){for(var i in t)t.hasOwnProperty(i)&&e.data(i,t[i])},_updateElement:function(e,t,i){var n=this._adapt(t,i);n.invisible?e.hide():e.show(),delete n.invisible,n.template&&(e.find('a[node-type="notice-content"]').html(n.template),delete n.template),this._updateElementData(e,n)},_find:function(e){return this.instance.find(e)},_getElements:function(){return this._find("ul.nt-list li")},ready:function(){return!!this.instance},init:function(t){if(this.instance)return void this.update();this._initTasks(),this._initElements();var i={elements:[]};for(var n in t.elements){var s=t.elements[n].type;s&&this.elements[s].template&&i.elements.push(this._adapt(n,t.elements[n]))}var a=this._template.render(e("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/cmt-notice.html.js"),i),o=this.jquery(a);this.instance=o,this.jquery(function(e){return function(){e.container=e.jquery(e.containerSelector),e.container.append(e.instance)}}(this)),this.update(t),this._bindEvents()},update:function(e){if(!e)var e=this._model;!function(e,t){for(var i in e)t[i]&&t[i].draw(e[i])}(e.tasks,this.tasks),function(e,t,i){t.each(function(){e.hasOwnProperty(n(this).data("alias"))||n(this).remove()});for(var s in e){for(var a=0,o=t.length;o>a;a++)if(n(t[a]).data("alias")==s){"static"==n(t[a]).data("static")&&i._updateElement(n(t[a]),s,e[s]);break}a==o&&i._addElement(s,e[s])}}(e.elements,this._getElements(),this),this._updateActionQueue(e)},_bindEvents:function(){!function(e,i,s,a){e.delegate("ul.nt-list li","click",function(e){t.log("notice-pop-click"),a.enableActions();var i="li"===n(e.target)[0].tagName?n(e.target):n(e.target).closest("li");i.hide();var o=i.data("type"),l=s[o].action,c=0;if(l&&l.length){for(var r=0,u=l.length;u>r&&a.actions.immediate[l[r]];r++)a.actions[l[r]](),c++;a.actionQueue=l.slice(c)}}),e.delegate("ul.nt-list li a.nt-close","click",function(e){e.preventDefault(),e.stopPropagation();var t="li"===n(e.target)[0].tagName?n(e.target):n(e.target).closest("li");t.hide();var o=!1;if(o){var l=t.data("type");"static"==t.data("static")?s[l].callbackToModel(i):s.dynamic.callbackToModel(i,t.data("alias")),s[l].callback&&s[l].callback(),a.update()}})}(this.instance,this._model,this.elements,this),function(e,t,i){for(var s in i){var a=i[s];n(document).delegate(a.targetSelector+" .module-cmt-notice-"+(1==a.type?"bubble":"dot"),"click",function(e){return function(){n(e).trigger("click")}}(a.clickPropagate)),n(document).delegate(a.clickPropagate,"click",function(e,t,i){return function(n){t.enableActions(),e.callbackToModel(i,null,null),e.callback&&e.callback(i),t.update(i)}}(a,e,t))}}(this,this._model,this.tasks)},hidePopWin:function(){this._find("ul.nt-list li").hide()}};i.exports=a})}),t("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/cmt-notice.css",function(e,t,i){var n=decodeURIComponent("%23SOHUCS%20%23SOHU_MAIN%20.module-cmt-notice-dot%2C.module-cmt-notice-dot%7Bz-index%3A1000%3Bdisplay%3Ablock%3Bwidth%3A4px%3Bheight%3A4px%3Bbackground-color%3A%23F74F4F%3Bborder-radius%3A2px%3Bcursor%3Apointer%7D%23SOHUCS%20%23SOHU_MAIN%20.module-cmt-notice-bubble%2C.module-cmt-notice-bubble%7Bz-index%3A1000%3Bdisplay%3Ablock%3Bmin-width%3A12px%3Bheight%3A16px%3Bline-height%3A16px%3Bpadding%3A0%202px%3Btext-align%3Acenter%3Bfont-size%3A12px%3Bfont-style%3Anormal%3Bfont-family%3Aarial%3Bcolor%3A%23FFF%3Bbackground-color%3A%23F74F4F%3Bborder-radius%3A8px%3Bcursor%3Apointer%7D%23SOHUCS%20%23SOHU_MAIN%20.module-cmt-notice%7Bposition%3Afixed%3Bright%3A0%3Bbottom%3A0%3Bpadding%3A38px%200%3Bfont-family%3A%22Microsoft%20YaHei%22%3Bz-index%3A999999%7D%23SOHUCS%20%23SOHU_MAIN%20.module-cmt-notice%20ul.nt-list%7Bmax-width%3A300px%3Btext-align%3Aright%3Boverflow%3Avisible%3Bposition%3Arelative%7D%23SOHUCS%20%23SOHU_MAIN%20.module-cmt-notice%20ul.nt-list%20li.nt-item%7Bposition%3Arelative%3Bdisplay%3Ainline-block%3Bmax-width%3A260px%3Bmin-width%3A200px%3Bheight%3A38px%3Bline-height%3A38px%3Bbackground-color%3A%23fff%3Bcolor%3A%23000!important%3Bmargin%3A5px%200%205px%2010px%3Bpadding-left%3A36px%3Bpadding-right%3A30px%3Bborder%3A1px%20solid%20%234398ed%3Bborder-right%3A0%3Btext-decoration%3Anone%3Bcursor%3Apointer%3Bfont-size%3A15px%7D%23SOHUCS%20%23SOHU_MAIN%20.module-cmt-notice%20ul.nt-list%20li.nt-item%20.nt-logo%7Bposition%3Aabsolute%3Btop%3A-1px%3Bleft%3A-20px%3Bwidth%3A40px%3Bheight%3A40px%3Bbackground%3Aurl(https%3A%2F%2Fchangyan.itc.cn%2Fmdevp%2Fextensions%2Fcmt-notice%2F023%2Fimages%2Fnotice-logo.png)%20no-repeat%7D%23SOHUCS%20%23SOHU_MAIN%20.module-cmt-notice%20ul.nt-list%20li.nt-item%20.nt-text%7Bcolor%3A%234398ed!important%3Btext-decoration%3Anone%7D%23SOHUCS%20%23SOHU_MAIN%20.module-cmt-notice%20ul.nt-list%20li.nt-item%20.nt-text%20i%7Bcolor%3A%234398ed!important%3Bpadding%3A0%204px%3Bfont-weight%3Abolder%3Bfont-size%3A17px%3Bfont-family%3A%22Microsoft%20YaHei%22%7D%23SOHUCS%20%23SOHU_MAIN%20.module-cmt-notice%20.nt-close%7Bdisplay%3Ainline-block%3Bposition%3Aabsolute%3Bright%3A11px%3Btop%3A11px%3Bwidth%3A16px%3Bheight%3A16px%3Bbackground%3Atransparent%20url(https%3A%2F%2Fchangyan.itc.cn%2Fmdevp%2Fextensions%2Fcmt-notice%2F023%2Fimages%2Fnotice-close.png)%20no-repeat%7D.module-cy-user-page%20.module-cmt-notice-dot%7Bposition%3Aabsolute%3Btop%3A0%3Bright%3A6px%3Bwidth%3A6px%3Bheight%3A6px%3Bbackground-color%3A%23F74F4F%3Bborder-radius%3A6px%7D.module-cy-user-page%20.module-cmt-notice-bubble%7Bdisplay%3Ainline-block%3Bposition%3Aabsolute%3Bmin-width%3A12px%3Bheight%3A16px%3Bline-height%3A16px%3Bpadding%3A0%202px%3Btext-align%3Acenter%3Bfont-size%3A12px%3Bfont-style%3Anormal%3Bfont-family%3Aarial%3Bcolor%3A%23FFF%3Bbackground-color%3A%23F74F4F%3Bborder-radius%3A16px%3Bmargin-left%3A4px%7D.module-cmt-float-bar%20.module-cmt-notice-bubble%7Bposition%3Aabsolute%3Btop%3A-8px%3B*top%3A-4px%3Bleft%3A20px%3Bmin-width%3A12px%3Bheight%3A16px%3Bline-height%3A16px%3Bpadding%3A0%202px%3Btext-align%3Acenter%3Bfont-size%3A12px%3Bfont-style%3Anormal%3Bfont-family%3Aarial%3Bcolor%3A%23FFF%3Bbackground-color%3A%23F74F4F%3Bborder-radius%3A8px%7D"),s=window.document,a=s.createElement("style");a.id="seaJs-css",a.setAttribute("type","text/css");var o=s.getElementById("seaJs-css");o?s.all?o.styleSheet.cssText+=n:o.textContent+=n:s.all?(a.styleSheet.cssText=n,s.getElementsByTagName("head").item(0).appendChild(a)):(a.innerHTML=n,s.getElementsByTagName("head").item(0).appendChild(a))}),t("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/item.html.js",function(e,t,i){"use strict";var n;return n=[],n.push('<li node-type="notice-${alias}" data-alias="${alias}" data-type="${type}" data-static="${static}" class="nt-item" style="#if(${invisible}) display: none #else #end">'),n.push('    <a node-type="notice-content" class="nt-text" href="javascript:void(0);">${template}</a>'),n.push('    <a class="nt-close" href="javascript:void(0);"></a>'),n.push("</li>"),n.join("\n")}),t("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/cmt-notice.html.js",function(e,t,i){"use strict";var n;return n=[],n.push('<div class="module-cmt-notice">'),n.push('    <ul class="nt-list">'),n.push("        #foreach ($el in ${elements})"),n.push('        <li node-type="notice-${el.alias}" data-alias="${el.alias}" data-type="${el.type}" data-static="${el.static}" class="nt-item" style="#if(${el.invisible}) display: none #else #end">'),n.push('            <div class="nt-logo"></div>'),n.push('            <a node-type="notice-content" class="nt-text" href="javascript:void(0);">${el.template}</a>'),n.push('            <a class="nt-close" href="javascript:void(0);"></a>'),n.push("        </li>"),n.push("        #end"),n.push("    </ul>"),n.push("</div>"),n.join("\n")}),t("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/control.js",function(e,t,i){window.changyan.api.ready(function(e){var t=e.util.jquery,n=(e.util.velocityjs,{ifPoll:!1,intervalId:null,cycle:1e3,tasks:[{api:e.getConfig("api")+"api/3/user/get_unread_profile",_debug:!1,_model:{latest_message_count:1,latest_support_count:3,latest_reply_count:2,latest_task_count:1,latest_user_achievement:1,reping_user_notice:1},callback:function(t,i){t.update({message:{type:"message",data:{num:i.latest_message_count||0}},support:{type:"support",data:{num:i.latest_support_count||0}},reply:{type:"reply",data:{num:i.latest_reply_count||0}},hots:{type:"hots",data:{num:0}},task:{type:"task",data:{num:i.latest_task_count||0}},history:{type:"history",data:{num:0}}});var n=0;for(var s in i)"number"==typeof i[s]&&(n+=i[s]);n>0&&e.log("notice-pop-view")},eventKey:null}],execViewPlan:function(){this._view.doActions()},disableViewPlan:function(){this._view.disableActions()},_model:null,_view:null,bindModel:function(e){return this._model=e,this._view&&this._view.bindModel(e),this},bindView:function(e){return this._view=e,this._model&&this._view.bindModel(this._model),this},updateView:function(){return this._initialized?void this._view.update(this._model):void this.init()},_execTasks:function(){for(var i=this,n=0;n<this.tasks.length;n++)this.tasks[n]._debug?(this.tasks[n].callback(this._model,this.tasks[n]._model),this.updateView()):t.ajax({url:this.tasks[n].api,data:{client_id:e.getFeConfig("appid")},dataType:"jsonp",scriptCharset:"utf-8",success:function(e,t){return function(n){return n.error_code?void i._view.hidePopWin():(t.callback(e._model,n),void e.updateView())}}(this,this.tasks[n])})},_poll:function(){this.intervalId&&this._abortPoll(),this.intervalId=self.setInterval(function(e){return function(){e.update()}}(this),this.cycle)},update:function(){return this._initialized?void this._execTasks():void this.init()},_initialized:!1,init:function(){this._initialized||(this._initialized=!0,this._view.init(this._model),this.ifPoll?this._poll():this.update())},_abortPoll:function(){window.clearInterval(this.intervalId)}});i.exports=n})}),t("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/readADHeight.js",function(e,t,i){window.changyan.api.ready(function(e){var t=e.util.jquery,n=(e.util.velocityjs,{initPos:function(){var e=["module-cmt-float-bar","module-cmt-notice"],i=t("body").find("div , iframe").filter(function(){return"none"==t(this).css("display")||n.inArray(t(this),e)?!1:"fixed"==t(this).css("position")&&parseInt(t(this).css("bottom"),10)<38&&parseInt(t(this).css("right"),10)<200&&parseInt(t(this).css("z-index"),10)>100?!0:void 0});if(i.length>0){var s=n.maxHeight(i);s>0&&t("body").find(".module-cmt-notice").css("bottom",s)}},inArray:function(e,t){for(var i=0;i<t.length;i++)if(e.hasClass(t[i]))return!0;return!1},maxHeight:function(e){for(var i=0,n=0;n<e.length;n++){var s=t(e[n]);s.height()>i&&(i=s.height())}return i}});i.exports=n})}),i("/Users/yanhao/.nvm/versions/node/v6.9.2/lib/node_modules/mdevp/cache/www/cmt-notice/cmt-notice.js")}();