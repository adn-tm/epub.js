EPUBJS.reader.FootnoteController = function(toc) {
	var reader = this;
	var book = this.book;	
	var footnoteFrame = $("#footnoteView");
	var footnoteClose = $("#footnoteClose");
	var isShown = false;
	var ANIMATION_DURATION = 400;
	if (!footnoteFrame)
		return ({}); 
	
	function hideFootnote() {
		if (!footnoteFrame)
			return;
		if (!isShown)
			return;
		isShown = false;
		footnoteFrame.fadeOut(ANIMATION_DURATION);
	} 
	
	$(window).on("click touchstart", function() { 
		if (isShown)
			hideFootnote(); 
	}, false);
	
	book.on("renderer:click", hideFootnote);
	book.on("renderer:touchstart", hideFootnote);
	
//	footnoteFrame.on("click touchstart", hideFootnote, false);
/*	footnoteClose.on("click touchstart", function() { 
			if (isShown)
				hideFootnote(); 
	}, false);
*/

	function showFootnote(event, textNode) {
		if (!footnoteFrame || !textNode)
				return;
		event.preventDefault();
		if (event.stopPropagation)    event.stopPropagation();
		if (event.cancelBubble!=null) event.cancelBubble = true;
			
		var x = event.clientX + window.scrollX;
		var y = event.clientY + window.scrollY+event.srcElement.offsetHeight;
		var clonedText = $(textNode).clone();
		var wrapper = $('<div id="footNodeWrapper"></div>');
		wrapper.append(clonedText);
		footnoteFrame.empty();
		footnoteFrame.append(wrapper);
		footnoteFrame.css({ top: y+"px", left: x+"px"});
		footnoteFrame.fadeIn({duration:ANIMATION_DURATION, complete:function(){ isShown = true; } });
		
	}
	
	

	book.on('renderer:locationChanged', function(cfi){
		hideFootnote();
	});
	
	book.on("renderer:showFootnote", function(event) {
	
		console.log("show footnote with event");
		console.log(event);
		if (!event) return;
		if (!event.srcElement) return;
		var hash = event.srcElement.hash;
		
		if (!hash)
				return false;
		if (hash.indexOf("#")!=0) 
			return false;
		var targetLink = book.renderer.doc.getElementById(hash.substr(1));
		if (!targetLink) 
			return false;
		var node = targetLink;
		var text = node.innerText;
			while (!text && node) {
				node = node.parentNode;
				text = node.innerText;
			}
		if (text && node) {
			console.log("FootNote text is:"+text);
			showFootnote(event, node);
						
		};
	});
	
	return {
		"show" : showFootnote,
		"hide" : hideFootnote
	};
};
