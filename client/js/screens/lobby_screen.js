tfn.LobbyScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function(isHost) {
		baseConstructor.call(this);
				
		// Add the background.
		this.addImage("background", 0, 0);
		
		// Set up the exit lobby button.
		this.addButton("menu-button-exit-lobby", 260, 670, function() {
			// For now we just head back to the main menu.
			//
			// TODO: server things?
			game.setScreenState(STATE_MAIN_MENU);
		});
		
		// Set up the start game button if we're a host, otherwise we
		// just set up a non-clickable waiting image.
		if (isHost) {
			this.addButton("menu-button-start-game", 552, 670, function() {
				// Go to the countdown screen.
				clientStartHostedGame();


				game.setScreenState(STATE_COUNTDOWN);
			});
		} else {
			this.addButton("menu-label-waiting", 552, 685, function(){});
			
			//wait for host to start game
			clientWaitForStartGame(function (data) {
				removeStartGameCallback();
				game.setScreenState(STATE_COUNTDOWN)
			});
		}
	}
});
