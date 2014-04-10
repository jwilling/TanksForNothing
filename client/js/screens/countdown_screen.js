tfn.CountdownScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function() {
		baseConstructor.call(this);
		
		// Add a blank background.
		this.addImage("background-blank", 0, 0);
		
		// Add the basic tank instructions image.
		this.addImage("menu-image-instructions", 0, 100);
		
		// Add the ready button.
		this.addButton("menu-button-ready", 399, 670, function() {
			// For now jump directly to the play screen.
			//
			// TODO: server stuff.
			game.setScreenState(STATE_GAME);
		});
	}
});
