tfn.JoinPrefsScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function() {
		baseConstructor.call(this);
		
		// Add the background.
		var backgroundImage = tfn.preloader.getResult("background");
		var background = new createjs.Bitmap(backgroundImage);
		
		// Set up the create game button.
		var createGameButtonImage = tfn.preloader.getResult("menu-button-create-game");
		var createGameButton = new createjs.Bitmap(createGameButtonImage);
		createGameButton.x = 399;
		createGameButton.y = 290;
		
		// Set up the join game button.
		var joinGameButtonImage = tfn.preloader.getResult("menu-button-join-game");
		var joinGameButton = new createjs.Bitmap(joinGameButtonImage);
		joinGameButton.x = 399;
		joinGameButton.y = 380;
		
		// Set up the callbacks.
		createGameButton.on("click", function() {
			game.setScreenState(STATE_LOBBY_HOST);
		});
		
		joinGameButton.on("click", function() {
			game.setScreenState(STATE_LOBBY_JOIN);
		});
		
		// Add the children.
		this.addChild(background);
		this.addChild(createGameButton);
		this.addChild(joinGameButton);
	}
});
