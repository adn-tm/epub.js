EPUBJS.reader.MetaController = function(meta) {
	var title = meta.bookTitle,
		author = meta.creator,
		lang = meta.language
	var $title = $("#book-title"),
			$author = $("#chapter-title"),
			$dash = $("#title-seperator");

		document.title = title+" – "+author; 

		$title.html(title);
		$author.html(author);
		$dash.show();

		if (lang)
			this.book.renderer.registerHook("beforeChapterDisplay", function(callback, renderer){
				if (renderer.doc) {
					var html = renderer.doc.getElementsByTagName("html")[0];
					if (html) 
						html.setAttribute("lang", lang?lang:"ru");
				}
				callback();
			}, true);
};

