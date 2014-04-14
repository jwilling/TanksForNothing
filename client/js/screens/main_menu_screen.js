tfn.MainMenuScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function() {
		baseConstructor.call(this);
		
		// Add the background.
		this.addImage("background", 0, 0);
		
		// Set up the new game button.
		this.addButton("menu-button-new-game", 399, 200, function() {
			game.setScreenState(STATE_LOBBY_HOST_PREFS);
		});
		
		// Set up the credits button.
		this.addButton("menu-button-credits", 399, 290, function() {

		});
		
		// Set up the options button.
		this.addButton("menu-button-options", 399, 380, function() {

		});
		
		// Set up the tutorial button.
		this.addButton("menu-button-tutorial", 399, 470, function() {
			game.setScreenState(STATE_LOBBY_HOST_PREFS);
		});
	}
});
