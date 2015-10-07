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
	
	var hashCode = function(s) {
		  var hash = 0, i, chr, len;
		  if (s.length == 0) return hash;
		  for (i = 0, len = s.length; i < len; i++) {
		    chr   = s.charCodeAt(i);
		    hash  = ((hash << 5) - hash) + chr;
		    hash |= 0; // Convert to 32bit integer
		  }
		  return hash.toString();
		};

	var createBookmarkItem = function(bm) {
		var listitem = document.createElement("li"),
		
				link = document.createElement("a"),
				rm = document.createElement("div");
		
		listitem.id = "bookmark-"+hashCode(bm.cfi);
		listitem.classList.add('list_item');
		
		
		link.textContent = bm.text || ""; 
		link.href = bm.cfi;
		link.classList.add('bookmark_link');
		link.addEventListener(eventName, function(event){
				var cfi = this.getAttribute('href');
				book.gotoCfi(cfi);
				event.preventDefault();
		}, false);

		rm.classList.add('bookmark_remove');
		rm.innerHTML = "&nbsp;"; 
		rm.setAttribute('data-cfi', bm.cfi);
		rm.addEventListener(eventName, function(event){
				var cfi = this.getAttribute('data-cfi');
				reader.removeBookmark(cfi);
		}, false);

		listitem.appendChild(rm);
		listitem.appendChild(link);
		
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
	
	this.on("reader:unbookmarked", function(index, cfi) {
		var $item = $("#bookmark-"+hashCode(cfi) );
		$item.remove();
	});

	return {
		"show" : show,
		"hide" : hide
	};
};