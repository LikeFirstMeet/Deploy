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
		
		iframe.setAttribute('src', '//tu.baixing.com/widget/w/zl-dybanner567.html');
		iframe.width = 300;
		iframe.height = 250;
		
		iframe.setAttribute('frameborder', 0);
		iframe.id = "zl-dybanner567";
		iframe.scrolling = "no";
		iframe.style.display = 'block';
		insertPoint.parentNode.insertBefore(iframe, insertPoint);
	} catch (e) {
		(new Image).src = '//www.baixing.com/c/ev/bxad?action=adwidget-err&mes=' + encodeURIComponent(e.stack)
	}
})();

