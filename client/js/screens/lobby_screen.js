tfn.LobbyScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function(isHost) {
		baseConstructor.call(this);
		
		// Add the background.
		var backgroundImage = tfn.preloader.getResult("background");
		var background = new createjs.Bitmap(backgroundImage);
		
		// Add the children.
		this.addChild(background);
	}
});
