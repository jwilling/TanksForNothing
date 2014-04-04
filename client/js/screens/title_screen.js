tfn.TitleScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function() {
		baseConstructor.call(this);
		
		// Add the background.
		var backgroundImage = tfn.preloader.getResult("title-background");
		var background = new createjs.Bitmap(backgroundImage);
		
		this.addChild(background);
		
		// Add an event listener for a click on the image.
		background.addEventListener("click", function(event) {
			game.setScreenState(STATE_MAIN_MENU);
		});
	}
});
