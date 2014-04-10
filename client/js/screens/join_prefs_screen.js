tfn.JoinPrefsScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function() {
		baseConstructor.call(this);
		
		// Add the background.
		this.addImage("background", 0, 0);
		
		// Add the create game button.
		this.addButton("menu-button-create-game", 399, 290, function() {
			game.setScreenState(STATE_LOBBY_HOST);
		});
		
		// Add the join game button.
		this.addButton("menu-button-join-game", 399, 380, function() {
			game.setScreenState(STATE_LOBBY_JOIN);
		});
	}
});
