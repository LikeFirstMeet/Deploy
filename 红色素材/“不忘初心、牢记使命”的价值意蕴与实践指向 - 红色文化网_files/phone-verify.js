!function(){function e(e){return"[object Function]"===Object.prototype.toString.call(e)}function n(n,o,t){if(i[n])throw new Error("Module "+n+" has been defined already.");e(o)&&(t=o),i[n]={factory:t,inited:!1,exports:null}}function o(n){var o,p,d,r;if(o=i[n],p={},d={exports:{}},!e(o.factory))throw new Error("Module "+n+" has no factory.");if(r=o.factory.call(void 0,t,p,d),void 0!==r)o.exports=r;else if(d.hasOwnProperty("exports")&&"object"==typeof d.exports&&d.exports instanceof Object==!0){var a,s=!1;for(a in d.exports)d.exports.hasOwnProperty(a)&&(s=!0);s===!1?o.exports=p:o.exports=d.exports}else o.exports=d.exports;o.inited=!0}function t(e){var n;if(n=i[e],!n)throw new Error("Module "+e+" is not defined.");return n.inited===!1&&o(e),n.exports}var i={};n("C:/Users/haoyan/AppData/Roaming/npm/node_modules/mdevp/cache/www/phone-verify/phone-verify.js",function(e,n,o){window.changyan.api.ready(function(n){var o=n.util.jquery,t=(n.util._,n.util.velocityjs),i=n.util.dialog,p=e("C:/Users/haoyan/AppData/Roaming/npm/node_modules/mdevp/cache/www/phone-verify/phone-verify.html.js");e("C:/Users/haoyan/AppData/Roaming/npm/node_modules/mdevp/cache/www/phone-verify/phone-verify.css");var d=n.getFeConfig("appid"),r={init:function(){var e=this;e.render()},render:function(){var e=this,n=t.render(p,{});i.show(n);var d=o('div[node-type="bind-phone-wrapper"]');d.find('span[node-type="close-btn"]').click(function(){e.close()}),d.find('a[node-type="submit"]').click(function(){e.checkPhoneNum(function(){e.bindPhone(function(){e.close()})})}),d.find('span[node-type="verify-button"]').click(function(){e.checkPhoneNum(function(){e.getVercode()})})},close:function(){i.close()},bindPhone:function(e){var t=o('div[node-type="bind-phone-wrapper"]'),i=o('input[node-type="phone"]').val(),p=o('input[node-type="code"]').val();o.ajax({cache:!1,dataType:"jsonp",timeout:3e4,type:"GET",url:n.getConfig("api")+"api/2/comment/bindMobile",data:{client_id:d,mobile:i,verify_code:p},success:function(n){0===n.error_code?e&&e():(3===n.error_code?n.error_msg="验证验证码限制":5===n.error_code?n.error_msg="验证码错误":n.error_msg="服务器错误，请稍候",t.find('span[node-type="phone-tips"]').hide(),t.find('span[node-type~="code-tips"]').html(n.error_msg).show())}})},getVercode:function(){var e=o('input[node-type="phone"]').val(),t=o('div[node-type="bind-phone-wrapper"]'),i=function(e,i){o.ajax({cache:!1,dataType:"jsonp",timeout:3e4,type:"GET",url:n.getConfig("api")+"api/2/comment/verifyCode",data:{client_id:d,mobile:e},success:function(e){e.error_code?(1===e.error_code?e.error_msg="手机号已绑定":3===e.error_code?e.error_msg="发送验证码限制":5===e.error_code?e.error_msg="发送验证码失败":e.error_msg="服务器错误，请稍候",t.find('span[node-type~="phone-tips"]').html(e.error_msg).show()):i&&i()}})};i(e,function(){t.find('span[node-type="phone-tips"]').hide(),t.find('span[node-type~="verify-button"]').hide(),t.find('span[node-type~="left-time"]').show();var e=59,n=function(){t.find('span[node-type~="left-time"] em').html(e),e--,e>=0?window.setTimeout(n,1e3):(t.find('span[node-type~="verify-button"]').show(),t.find('span[node-type~="left-time"]').hide())};n()})},checkPhoneNum:function(e){var n=o('div[node-type="bind-phone-wrapper"]'),t=n.find('input[node-type~="phone"]'),i=o.trim(t.val());i.match(/^1\d{10}$/)?e():n.find('span[node-type~="phone-tips"]').show()}};n.event.listen("changyan:submit",function(e,n){e.comment_id&&-100===e.comment_id&&r.init()})})}),n("C:/Users/haoyan/AppData/Roaming/npm/node_modules/mdevp/cache/www/phone-verify/phone-verify.html.js",function(e,n,o){"use strict";var t;return t=[],t.push('<div node-type="bind-phone-wrapper" class="bind-phone-wrapper-dw">'),t.push('    <div class="clear-g cont-title-dw"><span node-type="close-btn" class="title-close-dw"><a href="javascript:void(0)"></a></span><strong class="title-name-dw">绑定手机后才能发表评论哦</strong></div>'),t.push('    <div class="clear-g cont-form-dw">'),t.push('        <span class="form-name-dw">手机号</span>'),t.push('        <div class="clear-g form-action-dw">'),t.push('            <input node-type="phone" type="text" class="action-text-dfw" value="" name="">'),t.push("        </div>"),t.push("    </div>"),t.push('    <div class="cont-prompt-dw">'),t.push('        <span node-type="phone-tips" class="prompt-word-bd" style="display: none;">手机号码格式不正确</span>'),t.push("    </div>"),t.push('    <div class="clear-g cont-verify-dw">'),t.push('        <span class="verify-name-dw">短信验证码</span>'),t.push('        <div class="clear-g verify-action-dw">'),t.push('            <input node-type="code" type="text" class="action-text-dfw" value="" name=""><span node-type="verify-button" class="verify-btn-dw">点击获取验证码</span><span node-type="left-time" class="verify-time-dw"><em>60</em>秒后可重新获取验证码</span>'),t.push("        </div>"),t.push("    </div>"),t.push('    <div class="cont-prompt-dw">'),t.push('        <span node-type="code-tips" class="prompt-word-bd" style="display: none;">验证码错误</span>'),t.push("    </div>"),t.push('    <div class="cont-btn-dw">'),t.push('        <a node-type="submit" href="javascript:void(0)"><button class="btn-dfw"></button></a>'),t.push("    </div>"),t.push("</div>"),t.join("\n")}),n("C:/Users/haoyan/AppData/Roaming/npm/node_modules/mdevp/cache/www/phone-verify/phone-verify.css",function(e,n,o){var t=decodeURIComponent("%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%7Bwidth%3A400px%3Bheight%3A254px%3Bborder%3A1px%20solid%20%23ccd4d9%3Bbackground-color%3A%23fff%3Bfont-size%3A12px%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-title-dw%7Bheight%3A30px%3Bline-height%3A18px%3Bpadding%3A14px%200%200%3Bbackground-color%3A%23fafafa%3Bborder-bottom%3A1px%20solid%20%23ccd4d9%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-title-dw%20.title-close-dw%7Bfloat%3Aright%3Bwidth%3A18px%3Bheight%3A18px%3Boverflow%3Ahidden%3Bmargin%3A0%2012px%200%200%3Bbackground%3Aurl(%2F%2Fchangyan.sohu.com%2Fmdevp%2Fextensions%2Fphone-verify%2F004%2Fimage%2Fb17.png)%3Bcursor%3Apointer%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-title-dw%20.title-close-dw%3Ahover%7Bbackground%3Aurl(%2F%2Fchangyan.sohu.com%2Fmdevp%2Fextensions%2Fphone-verify%2F004%2Fimage%2Fb18.png)%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-title-dw%20.title-name-dw%7Bfont-size%3A14px%3Bfont-weight%3A700%3Bdisplay%3Ainline-block%3Bpadding%3A0%200%200%2020px%3Bcolor%3A%23333%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-form-dw%7Bpadding%3A30px%200%200%3Bheight%3A33px%3Boverflow%3Ahidden%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-form-dw%20.form-name-dw%7Bfloat%3Aleft%3Bline-height%3A16px%3Bpadding%3A9px%2012px%200%200%3Bwidth%3A90px%3Btext-align%3Aright%3Bfont-size%3A14px%3Bcolor%3A%23333%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-form-dw%20.form-action-dw%20.action-text-dfw%7Bwidth%3A254px%3Bheight%3A31px%3Bline-height%3A31px%3Bpadding%3A0%200%200%208px%3Bfont-size%3A14px%3Bfloat%3Aleft%3Bvertical-align%3A-4px%3Bborder%3A1px%20solid%20%23ccd4d9%3Bcolor%3A%23333%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-prompt-dw%7Bheight%3A16px%3Bline-height%3A16px%3Boverflow%3Ahidden%3Bpadding%3A0%200%200%20102px!important%3Bmargin%3A5px%200%204px%3Bcolor%3A%23ee542a%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-verify-dw%7Bheight%3A33px%3Boverflow%3Ahidden%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-verify-dw%20.verify-name-dw%7Bfloat%3Aleft%3Bfont-size%3A14px%3Bline-height%3A16px%3Bpadding%3A9px%2012px%200%200%3Btext-align%3Aright%3Bwidth%3A90px%3Bcolor%3A%23333%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-verify-dw%20.verify-action-dw%20.action-text-dfw%7Bfloat%3Aleft%3Bfont-size%3A14px%3Bheight%3A31px%3Bline-height%3A31px%3Bpadding%3A0%200%200%208px%3Bwidth%3A98px%3Bborder%3A1px%20solid%20%23ccd4d9%3Bcolor%3A%23333%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-verify-dw%20.verify-action-dw%20.verify-btn-dw%7Bfloat%3Aleft%3Bwidth%3A146px%3Bheight%3A33px%3Boverflow%3Ahidden%3Bline-height%3A34px%3Bmargin-left%3A10px%3Btext-align%3Acenter%3Bcolor%3A%23fff%3Bbackground-color%3A%235488af%3Bfont-size%3A14px%3Bcursor%3Apointer%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-verify-dw%20.verify-action-dw%20.verify-time-dw%7Bdisplay%3Anone%3Bfloat%3Aleft%3Bwidth%3A134px%3Bheight%3A31px%3Boverflow%3Ahidden%3Bline-height%3A32px%3Bmargin-left%3A10px%3Bpadding%3A0%205px%3Bborder%3A1px%20solid%20%23d1d2d4%3Bcolor%3A%239a9a9a%3Bbackground-color%3A%23f5f6f8%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-btn-dw%7Bheight%3A33px%3Boverflow%3Ahidden%3Bpadding%3A0%200%200%20102px%7Ddiv.windows-define-dg%20a%7Bcolor%3A%2344708e%3Btext-decoration%3Anone%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-btn-dw%20.btn-dfw%7Bwidth%3A78px%3Bheight%3A33px%3Bpadding%3A0%3Bcursor%3Apointer%3Bborder%3A0%3Bbackground-image%3Aurl(%2F%2Fchangyan.sohu.com%2Fmdevp%2Fextensions%2Fphone-verify%2F004%2Fimage%2Fbg11.gif)%7D%23SOHUCS%20%23SOHU_MAIN%20.bind-phone-wrapper-dw%20.cont-btn-dw%20.btn-dfw%3Ahover%7Bbackground-image%3Aurl(%2F%2Fchangyan.sohu.com%2Fmdevp%2Fextensions%2Fphone-verify%2F004%2Fimage%2Fbg12.gif)%7D"),i=window.document,p=i.createElement("style");p.id="seaJs-css",p.setAttribute("type","text/css");var d=i.getElementById("seaJs-css");d?i.all?d.styleSheet.cssText+=t:d.textContent+=t:i.all?(p.styleSheet.cssText=t,i.getElementsByTagName("head").item(0).appendChild(p)):(p.innerHTML=t,i.getElementsByTagName("head").item(0).appendChild(p))}),o("C:/Users/haoyan/AppData/Roaming/npm/node_modules/mdevp/cache/www/phone-verify/phone-verify.js")}();