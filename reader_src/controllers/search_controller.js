EPUBJS.reader.SearchController = function(book) {
	var $list = $("#searchResults");
	var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
	var eventName = supportsTouch?"touchstart":"click";
	
	var currentChapter = false;

	var generateTocItems = function(matches) {
		matches.forEach(function(chapter) {
			var listitem = document.createElement("li"),
					link = document.createElement("a");
  				  toggle = document.createElement("a"); 

			var subitems;

			// listitem.id = "toc-"+chapter.id;
			listitem.classList.add('list_item');

			link.textContent = chapter.excerpt;
			link.href = chapter.cfi;
			
			link.classList.add('search_link');

			listitem.appendChild(link);
			$list.append(listitem);
		});
	};

	var onShow = function() {
		$("#searchView").show();
	};

	var onHide = function() {
		$("#searchView").hide();
	};
	



	
/*
	$list.find(".toc_toggle").on("click", function(event){
			var $el = $(this).parent('li'),
					open = $el.hasClass("openChapter");

			event.preventDefault();
			if(open){
				$el.removeClass("openChapter");
			} else {
				$el.addClass("openChapter");
			}
	});
*/
	var doSearch = function(){
		var qry = $("#searchBox").val();
		$list.empty();
		if (qry) {
			$("#searchProgress").show();
			book.search(qry).then(function(matches){
					$("#searchProgress").hide();
					generateTocItems(matches);
					$list.find(".search_link").on(eventName, function(event){
							var url = this.getAttribute('href');

							event.preventDefault();

							//-- Provide the Book with the url to show
							//   The Url must be found in the books manifest
							book.gotoCfi(url).then(function(){
								var epubcfi = new EPUBJS.EpubCFI();
								var doc = book.renderer.doc;
								var win = reader.book.renderer.render.window;
								if (doc && win) {
									// epubcfi.addMarker(url, doc);
									
									var range=epubcfi.generateRangeFromCfi(url, doc);
									range.setEnd(range.endContainer, range.startOffset+qry.length );
									console.log(range.toString());
									if(window.getSelection) { // FF, Safari, Opera
							             var sel = win.getSelection();
							             sel.removeAllRanges();
							             sel.addRange(range);
							         } else { // IE
							             document.selection.empty();
							             range.select();
							         }; 
							    }
								console.log(range);
							});
					});
			});
		}
		onShow();
	};

	$("#searchBox").keypress(function(e){
		if (e.keyCode == 13 && $("#searchBox").val())
			$("#show-Search").click();
	});

	$("#show-Search").on(eventName, doSearch)
	

	return {
		"show" : onShow,
		"hide" : onHide
	};
};
