(function(){
	try {
		var insertPoint;
		if (document.currentScript) {
			insertPoint = document.currentScript;
		} else {
			var phid = 'w_' + Math.random().toString(36).slice(2);
			document.write('<div id="' + phid + '" style="display:none"></div>');
			insertPoint = document.getElementById(phid);
		}
		var iframe = document.createElement('iframe');
		iframe.allowTransparency="true"
		
		iframe.setAttribute('src', '//tu.baixing.com/widget/w/zl-dybanner568.html');
		iframe.width = 640;
		iframe.height = 100;
		
		iframe.setAttribute('frameborder', 0);
		iframe.id = "zl-dybanner568";
		iframe.scrolling = "no";
		iframe.style.display = 'block';
		insertPoint.parentNode.insertBefore(iframe, insertPoint);
	} catch (e) {
		(new Image).src = '//www.baixing.com/c/ev/bxad?action=adwidget-err&mes=' + encodeURIComponent(e.stack)
	}
})();

