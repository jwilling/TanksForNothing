tfn.TitleScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function() {
		baseConstructor.call(this);
		
		// Add the (clickable) background.
		this.addButton("background-title", 0, 0, function() {
			game.setScreenState(STATE_MAIN_MENU);
		});
	}
});
