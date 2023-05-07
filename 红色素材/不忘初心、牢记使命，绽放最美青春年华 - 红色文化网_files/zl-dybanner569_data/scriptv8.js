var referrer = document.referrer;
var referrerHost = referrer.split('/')[2];
var clickTimes = getCookie('__gy_track_click') || 0;
var clickTimesJs = 0;
var iframe = document.getElementById('slot');
var mask = iframe.getAttribute('data-mask');
var placeholder = document.getElementById('placeholder');
var defaultWidget = '//tu.baixing.com/widget/default';
var trackShow = false;

if (clickTimes>3) iframe.setAttribute('src', defaultWidget)

var fingerPrint = FingerPrint();

function log(data) {
  data.r = Math.random().toString(36).substring(12);
  var sdata = serialize(data);
  var time = (new Date()).getTime();

  var img_bx = window[mask + time + "clk_bx"] = new Image();
  var img_admx = window[mask + time + "clk_admx"] = new Image();
  var img_ly = window[mask + time + "clk_ly"] = new Image();

  img_bx.src = '//www.baixing.com/c/ev/admx_click?' + sdata;
  img_admx.src = '//log.tu.baixing.com/track/click?' + sdata;
  var track2 = getHashValue('clk');
  if (track2) img_ly.src = decodeURIComponent(track2) + "&tm=" + time;
  function getHashValue(key) {
    var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
    return matches ? matches[1] : null;
  }
}

function serialize(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function setCookie(key, name, cf){
  var str = key + "=" + name;
  if(cf){
    if(cf.expires){
      str += ";expires=" + cf.expires.toUTCString();
    }
    str += ";path=/";
    if(cf.domain){
      str += ";domain=" + cf.domain;
    }
    if(cf.secure){
      str += ";secure=" + cf.secure;
    }
  }
  document.cookie = str;
}

function bind(el, ename, fn, cap){
  cap = cap || false;
  if(el.addEventListener){
    el.addEventListener(ename, fn, cap);
  }else{
    el.attachEvent("on"+ename, fn);
  }
}

function trackIframeClick() {
  var isOverIFrame = false;
  var enterPoint;
  var startTime = (new Date()).getTime();
  bind(iframe, 'mouseenter', function(e){
    window.focus();
    isOverIFrame = true;
    enterPoint = {x:e.clientX, y:e.clientY};
  });
  bind(iframe, 'mouseout', function(){
    isOverIFrame = false;
  });
  bind(window, 'blur', function(){
    //window.setTimeout(function (){window.focus();},300);
    if (!isOverIFrame) return
    var data = {}
    data.id = mask;
    if (referrer) {
      data.host = referrerHost;
      data.url = referrer;
    }
    data.gyTrackId = getCookie('__admx_track_id');
    data.timestamp = Math.floor(Date.now() / 1000)
    var date = new Date;
    date.setMinutes ( date.getMinutes() + 30 );
    setCookie('__gy_track_click', ++clickTimes, {
      expires: date
    });
    clickTimesJs = clickTimesJs + 1;
    if (clickTimes > 3 || clickTimesJs > 3) {
      if(iframe.getAttribute('src')!=defaultWidget){iframe.setAttribute('src',defaultWidget)}
      data.isDefault=1;
    }
    data.enterPoint = enterPoint.x + ',' + enterPoint.y;
    data.timeDelta = (new Date()).getTime() - startTime;
    data.referrer = document.referrer;
    data.canvasPrint = fingerPrint.canvasPrint();
    data.platform = fingerPrint.platform();
    data.screen = fingerPrint.screenPrint();
    data.rid = iframe.getAttribute('data-rid');
    data.cid = iframe.getAttribute('data-cid');
    data.blex = iframe.getAttribute('data-blex');
    data.oplatform = iframe.getAttribute('data-platform');
    data.size = iframe.getAttribute('data-size');
    data.checksum = iframe.getAttribute('data-checksum');
    log(data)
  }, true);
}
trackIframeClick()

function trackIframeShow() {
    if (trackShow) return;
    trackShow = true;
    //只要document ready则就算一次show
    var data = {};
    data.id = mask;
    data.referrer = document.referrer;
    data.rid = iframe.getAttribute('data-rid');
    data.cid = iframe.getAttribute('data-cid');
    data.blex = iframe.getAttribute('data-blex');
    data.oplatform= iframe.getAttribute('data-platform');
    data.size = iframe.getAttribute('data-size');
    data.checksum = iframe.getAttribute('data-checksum');
    data.uri = document.URL
    data.canvasPrint = fingerPrint.canvasPrint();
    data.platform = fingerPrint.platform();
    data.screen = fingerPrint.screenPrint();
    data.time = (new Date()).getTime();

    var sdata = serialize(data);
    var img = window[mask + data.time + "show"] = new Image();
    img.src = '//log.tu.baixing.com/track/show?' + sdata;
}

bind(window, 'load', trackIframeShow)

function FingerPrint() {
  function canvasPrint() {
    var canvas = document.createElement('canvas');
    var ctx;
    try { ctx = canvas.getContext('2d');}
    catch (e) { return ""; }

    var txt = 'Admx.JS <canvas> 1.0';
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);
    var dataUrl = canvas.toDataURL();
    return murmurhash3_32_gc(dataUrl, 256);
  }
  function platform() {
    return navigator.platform || 'unknown';
  }
  function screenPrint() {
    return getCurrentResolution() + "," + getAvailableResolution() + "," + getColorDepth();
  }
  function getColorDepth() { return screen.colorDepth; }
  function getCurrentResolution() { return screen.width + "x" + screen.height; }
  function getAvailableResolution() { return screen.availWidth + "x" + screen.availHeight; }
  return {canvasPrint: canvasPrint, platform: platform, screenPrint: screenPrint}
}

function murmurhash3_32_gc(key, seed) {
  var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;
  remainder = key.length & 3; // key.length % 4
  bytes = key.length - remainder;
  h1 = seed;
  c1 = 0xcc9e2d51;
  c2 = 0x1b873593;
  i = 0;
  while (i < bytes) {
      k1 =
        ((key.charCodeAt(i) & 0xff)) |
        ((key.charCodeAt(++i) & 0xff) << 8) |
        ((key.charCodeAt(++i) & 0xff) << 16) |
        ((key.charCodeAt(++i) & 0xff) << 24);
    ++i;
    k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

    h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
    h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
    h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
  }
  k1 = 0;
  switch (remainder) {
    case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
    case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
    case 1: k1 ^= (key.charCodeAt(i) & 0xff);

    k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= k1;
  }
  h1 ^= key.length;
  h1 ^= h1 >>> 16;
  h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
  h1 ^= h1 >>> 13;
  h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
  h1 ^= h1 >>> 16;
  return h1 >>> 0;
}
