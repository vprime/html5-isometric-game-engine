// User Interface
var ui = {
	init:function(){
		ui.eventListeners();
		ui.hideAlert();
		ui.hideWin();
	},
	
	eventListeners:function(){
		$('#blog').click(function(){
           ui.browser('http://blog.vincentprime.com/');
        });
	},
	
	updateBrowserMessage: 'Your browser does not support the HTML5 Canvas element. Please update your system, or download <a href="http://mozilla.com">Mozilla Firefox</a>.',
	
	browser:function(url){
		if ($('#browser').length == 0 ) {
			var browser = '<div id="browser"><div id="title">browser</div><div id="close-browser" class="close-button" onclick="$(\'#browser\').hide();">x</div><iframe src="' + url + '" /></div>';
			$('#gameScreen').after(browser);
		} else {
			$('#browser').show();
			$('#browser iframe').attr('src', url);
		}
	},
	
	showAlert:function(message){
		$('#alertBox').html(message);
		$('#alertBox').fadeIn(500);
		ui.hideAlert();
	},
	hideAlert:function(){
		$('#alertBox').fadeOut(1000);
	},
	
	showWin:function(){
		$('#winBox').html('Mmmm! Finally some tasty silage!');
		$('#wintBox').fadeIn(500);
	},
	hideWin:function(){
		$('#winBox').hide();
	},
	
	showLoading:function(){
		$('#loading').show();
	},
	hideLoading:function(){
		$('#loading').hide();
	},

	/*
	* Debug Methods
	*/
	blockLocation:function(XY){
		$('#block-location .x').html(XY[0]);
		$('#block-location .y').html(XY[1]);
	},
	pixelLocation:function(XY){
		$('#pixel-location .x').html(XY[0]);
		$('#pixel-location .y').html(XY[1]);
	},

	expandButton:function(){
		$('.expand-button').click(function(element){
			element.parent('.expand').css('expanded');
		});
	}
}; 
