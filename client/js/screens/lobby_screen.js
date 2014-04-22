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
		
		
		// Update our labels whenever the game env updates, meaning
		// a player has either joined or left the game.
		gameEnvUpdateCallback = this.updatePlayerLabels.bind(this);
		this.updatePlayerLabels(gameEnv);
	}
	
	this.updatePlayerLabels = function(env) {
		var text = "";
		
		// Iterate over the players.
		for (var key in env.players) {
			if (!env.players.hasOwnProperty(key)) continue;
			var player = gameEnv.players[key];
			text += "Player " + player.playerNum + "\n";
		}
		
		if (this.playersLabel) {
			this.removeChild(this.playersLabel);
		}
		
		this.playersLabel = this.addLabel(text, "24px Futura", "white", 465, 350);
		
		game.stage.update();
	}
});
