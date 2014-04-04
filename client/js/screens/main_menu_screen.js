tfn.MainMenuScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function() {
		baseConstructor.call(this);
		
		// Add the background.
		var backgroundImage = tfn.preloader.getResult("background");
		var background = new createjs.Bitmap(backgroundImage);
		
		// Set up the new game button.
		var newGameButtonImage = tfn.preloader.getResult("menu-button-new-game");
		var newGameButton = new createjs.Bitmap(newGameButtonImage);
		newGameButton.x = 399;
		newGameButton.y = 200;
		
		// Set up the credits button.
		var creditsButtonImage = tfn.preloader.getResult("menu-button-credits");
		var creditsButton = new createjs.Bitmap(creditsButtonImage);
		creditsButton.x = 399;
		creditsButton.y = 290;
		
		// Set up the options button.
		var optionsButtonImage = tfn.preloader.getResult("menu-button-options");
		var optionsButton = new createjs.Bitmap(optionsButtonImage);
		optionsButton.x = 399;
		optionsButton.y = 380;
		
		// Set up the tutorial button.
		var tutorialButtonImage = tfn.preloader.getResult("menu-button-tutorial");
		var tutorialButton = new createjs.Bitmap(tutorialButtonImage);
		tutorialButton.x = 399;
		tutorialButton.y = 470;
		
		// Set up the callbacks.
		newGameButton.on("click", function() {
			game.setScreenState(STATE_LOBBY_HOST_PREFS);
		});
		
		// Add the children.
		this.addChild(background);
		this.addChild(newGameButton);
		this.addChild(creditsButton);
		this.addChild(optionsButton);
		this.addChild(tutorialButton);
	}
});
