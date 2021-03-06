EPUBJS.reader.SettingsController = function() {
	var FONTS={"Serif":"PT Serif", "Sans":"PT Sans"};
	var book = this.book;

	var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
	var eventName = supportsTouch?"touchstart":"click";

	var reader = this;
	var DEFAULT_SETTINGS={
				fontSize:12,
				fontName:"FiraSans",
				color:"101010",
				background:"FFFFFF"
			};
	var settings=(window.localStorage?JSON.parse(window.localStorage.getItem('settings')):undefined);
	if (!settings) {
			settings=DEFAULT_SETTINGS

		if (window.localStorage)
				window.localStorage.setItem('settings', JSON.stringify(settings) );
	};




	for(var key in DEFAULT_SETTINGS) {
		settings[key] = settings[key] || DEFAULT_SETTINGS[key];	
	}

	book.settings.styles=settings;

	var $settings = $("#settings-modal"),
			$overlay = $(".overlay");

	var show = function() {
		$settings.addClass("md-show");
	};

	var hide = function() {
		$settings.removeClass("md-show");
	};
			

	var $sidebarReflowSetting = $('#sidebarReflow');

 	$("#textColorPicker").css('background-color', '#'+settings.color).ColorPicker({
		color: '#'+settings.color,
		onChange: function (hsb, hex, rgb) {
			settings.color=hex;
			book.renderer.setStyle("color", '#'+settings.color);
			$('#textColorPicker').css('backgroundColor', '#' + hex);
		}
	});

 	$("#backgroundColorPicker").css('background-color', '#'+settings.background).ColorPicker({
		color: '#'+settings.background,
		onChange: function (hsb, hex, rgb) {
			settings.background = hex;
			//	book.renderer.setStyle("background-color", '#' +settings.background);
			$("#main").css('backgroundColor', '#' + settings.background);
			$('#backgroundColorPicker').css('backgroundColor', '#' + hex);
		}
	});

	$sidebarReflowSetting.on(eventName, function() {
		reader.settings.sidebarReflow = !reader.settings.sidebarReflow;
	});

	$settings.find(".closer").on(eventName, function() {
		applySettings();
		hide();
	});

	$overlay.on(eventName, function() {
		applySettings();
		hide();
	});


      $('#settings-fontsize').val(settings.fontSize);
      $('#settings-font-'+settings.fontName).addClass("selected");

      $('#settings-fontsize-minus').on(eventName, function(){
      	if (settings.fontSize<6)
      		return;
      	settings.fontSize-=1;
      	$('#settings-fontsize').val(settings.fontSize);
      });
      $('#settings-fontsize-plus').on(eventName, function(){
      	if (settings.fontSize>40)
      		return;
      	settings.fontSize+=1;
      	$('#settings-fontsize').val(settings.fontSize);
      });

      $('#settings-font-FiraSans,#settings-font-PTSans,#settings-font-PTSerif').on(eventName, function(){
      	settings.fontName=this.id.split('-').pop();
      	$('#settings-font-FiraSans,#settings-font-PTSans,#settings-font-PTSerif').removeClass("selected");
      	$(this).addClass("selected");
      }); 


	var applySettings = function() {
		book.renderer.setStyle("fontSize", settings.fontSize+"pt");
		book.renderer.setStyle("font-family", settings.fontName);
		book.renderer.setStyle("color", '#'+settings.color);
		$(".arrow").css("color", '#'+settings.color);
		$("#main").css('backgroundColor', '#' + settings.background);
		if (window.localStorage)
				window.localStorage.setItem('settings', JSON.stringify(settings) );
	}
	book.renderer.registerHook("beforeChapterDisplay", function(callback, renderer){
		/* var path =  window.location.pathname;
			path=path.split("/");
			if (path.length>2) {
				path.pop(); path.pop();
			} 
			path = path.join("/");  */

			var path= window.location.origin+(EPUBJS.cssPath.indexOf("/")!=0?"/":"") + EPUBJS.cssPath;
			path = path.replace(/\/$/, '');
			applySettings();
			renderer.applyHeadTags({
				'link':{'rel':'stylesheet', 'href':path+'/user-settings.css'}
			});
			renderer.applyHeadTags({
				'link':{'rel':'stylesheet', 'href':path+'/fonts/fonts.css'}
			});
			
		
		callback();
	}, true);


	// applySettings();

	return {
		"show" : show,
		"hide" : hide
	}; 
};