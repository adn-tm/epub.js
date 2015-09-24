EPUBJS.reader.SettingsController = function() {
	var FONTS={"Serif":"PT Serif", "Sans":"PT Sans"};
	var book = this.book;
	var reader = this;
	var settings=(window.localStorage?window.localStorage.getItem('settings'):undefined);
	if (!settings) {
			settings={
				fontScale:100,
				fontName:"PT Serif",
				color:"black",
				background:"white"
			};
		if (window.localStorage)
				window.localStorage.setItem('settings', settings);
	};

	var $settings = $("#settings-modal"),
			$overlay = $(".overlay");

	var show = function() {
		$settings.addClass("md-show");
	};

	var hide = function() {
		$settings.removeClass("md-show");
	};

	var $sidebarReflowSetting = $('#sidebarReflow');

	$settings.append("<div id='settings-color' class='settings-label'>Цвет текста:<div class='colorPicker'></div></div>");
	$settings.append("<div id='settings-background'  class='settings-label'>Цвет фона:<div class='colorPicker'></div></div>");

	$(".colorPicker").ColorPicker({flat: true});

	$sidebarReflowSetting.on('click', function() {
		reader.settings.sidebarReflow = !reader.settings.sidebarReflow;
	});

	$settings.find(".closer").on("click", function() {
		applySettings();
		hide();
	});

	$overlay.on("click", function() {
		applySettings();
		hide();
	});
	var applySettings = function() {
		book.renderer.setStyle("font-size", settings.fontScale+"%");
		book.renderer.setStyle("font-family", settings.fontName);
		book.renderer.setStyle("color", settings.color);
		book.renderer.setStyle("background-color", settings.background);
		if (window.localStorage)
				window.localStorage.setItem('settings', settings);
	}
	book.renderer.registerHook("beforeChapterDisplay", function(callback, renderer){
		 var path = window.location.origin + window.location.pathname;
		
			path=path.split("/");
			path.pop(); path.pop();
			path = path.join("/"); 
			renderer.applyHeadTags({
				'link':{'rel':'stylesheet', 'href':path+'/reader/css/user-settings.css'}
			});
			renderer.applyHeadTags({
				'link':{'rel':'stylesheet', 'href':path+'/reader/css/fonts/fonts.css'}
			});
			
		
		callback();
	}, true);



	return {
		"show" : show,
		"hide" : hide
	};
};