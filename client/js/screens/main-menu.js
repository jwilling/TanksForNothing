game.MainMenuScreen = me.ScreenObject.extend({
	init : function() {
		this.parent(true, false);
		this.z = 0;				
	},
	
	// Called when this screen is set to be the current state.
	//
	// Buttons and images are set here to avoid interfering with
	// other screens while they are still visible.
	onResetEvent : function() {
		// Set up the background sprite and make sure its
		// z-index is at the very bottom.
		var backgroundSprite = new ImageSprite("background", 0, 0, null, null, 100);
		
		// Set up the new game button.
		var newGameButton = new ImageButton("menu-button-new-game", 399, 200);
		newGameButton.clickHandler = function() {
			// TODO: this should go to the lobby, not directly to the game!
			me.state.change(STATE_GAME);
		};
		
		// Set up the credits button.
		var creditsButton = new ImageButton("menu-button-credits", 399, 290);
		creditsButton.clickHandler = function() {
			me.state.change(STATE_CREDITS);
		}
		
		// Set up the optons button.
		var optionsButton = new ImageButton("menu-button-options", 399, 380);
		optionsButton.clickHandler = function() {
			me.state.change(STATE_OPTIONS);
		}
	
		// Set up the tutorial button.
		var tutorialButton = new ImageButton("menu-button-credits", 399, 470);
		tutorialButton.clickHandler = function() {
			me.state.change(STATE_TUTORIAL);
		}

		// Loop over all of the sprites and add them to the world.
		this.sprites = [ backgroundSprite, newGameButton, creditsButton, optionsButton, tutorialButton ];
		for (var i = 0; i < this.sprites.length; i++) {
			me.game.world.addChild(this.sprites[i]);
		}
		
		// Sort the world to layer the objects correctly.
		me.game.world.sort();
	},
	
	onDestroyEvent : function() {
		// Get rid of all of the sprites / buttons we added.
		for (var sprite in this.sprites) {
			me.game.world.removeChild(sprite);
		}
	},
	
	draw : function(context) {
		// Clear the canvas.
		me.video.clearSurface(context, "#000");
	},
});
