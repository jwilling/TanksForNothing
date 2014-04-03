(function() {
	var MainMenuScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
		this.constructor = function() {
			// Add the background.
			var backgroundImage = tfn.preloader.getResult("background");
			var background = new createjs.Bitmap(backgroundImage);
			
			this.addChild(background);
		}
	});
	
	tfn.MainMenuScreen = MainMenuScreen;
})();
