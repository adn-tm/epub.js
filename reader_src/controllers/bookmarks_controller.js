EPUBJS.reader.BookmarksController = function() {
	var reader = this;
	var book = this.book;
	
	var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
	var eventName = supportsTouch?"touchstart":"click";

	var $bookmarks = $("#bookmarksView"),
			$list = $bookmarks.find("#bookmarks");
	
	var docfrag = document.createDocumentFragment();
	
	var show = function() {
		$bookmarks.show();
	};

	var hide = function() {
		$bookmarks.hide();
	};
	
	var counter = 0;
/*	
	var getBookmarkCaption = function(cfi, maxLength) {
		if (!maxLength)
				maxLength = 100;
		var epubcfi =new EPUBJS.EpubCFI();
		var a=epubcfi.generateRangeFromCfi(cfi, reader.book.renderer.doc);
		if (a) {
			var text=a.toString();
			
			if (text.length>maxLength) {
				text = text.substr(0, maxLength)+"...";
			} else if (text.length<20) {
			// TODO: cut some characters from next element	
			}
		} else text=cfi; 
		return text;
	}
*/
	var createBookmarkItem = function(bm) {
		var listitem = document.createElement("li"),
				link = document.createElement("a");
		
		listitem.id = "bookmark-"+counter;
		listitem.classList.add('list_item');
		
		//-- TODO: Parse Cfi
		link.textContent = bm.text || ""; // getBookmarkCaption(cfi); // cfi;
		link.href = bm.cfi;

		link.classList.add('bookmark_link');
		
		link.addEventListener(eventName, function(event){
				var cfi = this.getAttribute('href');
				book.gotoCfi(cfi);
				event.preventDefault();
		}, false);
		
		listitem.appendChild(link);
		
		counter++;
		
		return listitem;
	};

	this.settings.bookmarks.forEach(function(bm) { 
		var bookmark = createBookmarkItem(bm);
		docfrag.appendChild(bookmark);
	});
	
	$list.append(docfrag);
	
	this.on("reader:bookmarked", function(bm) {
		var item = createBookmarkItem(bm);
		$list.append(item);
	});
	
	this.on("reader:unbookmarked", function(index) {
		var $item = $("#bookmark-"+index);
		$item.remove();
	});

	return {
		"show" : show,
		"hide" : hide
	};
};