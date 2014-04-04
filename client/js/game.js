// Namespace.
this.tfn = this.tfn || {};
var stage;
var game = {
	start : function() {
		// Create the stage with the canvas associated with the
		// "game" id.
		//
		// There is only one stage for the whole game. All parts
		// of the game will be added as children onto this stage.
		this.stage = new createjs.Stage("game");
		
		// Set up the ticker which will attempt to pulse at 60 fps.
		//
		// The ticker is set up to use RAF_SYNCHED, which means it will
		// attempt to sync with the display refresh rate using the
		// requestAnimationFrame API.
		//
		// For now, we refresh the entire stage each tick. This really
		// isn't very efficient, and it might be better to allow each
		// object to refresh itself when needed.
		createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
		createjs.Ticker.addEventListener("tick", this.stage);
		
		// Start our game with the preloading screen.
		this.setScreenState(STATE_PRELOADING);
	},
	
	setScreenState : function(screenState) {
		// Remove any current screens we have displayed in prepration
		// for transitioning to the new screen.
		if (this.currentScreen) {
			this.stage.removeChild(this.currentScreen);
			this.currentScreen.onDestroyHandler();
		}
				
		switch (screenState) {
			case STATE_PRELOADING: {
				this.currentScreen = new tfn.PreloadingScreen();
				break;
			}
			case STATE_SPLASH: {
				this.currentScreen = new tfn.TitleScreen();
				break;
			}
			case STATE_MAIN_MENU: {
				this.currentScreen = new tfn.MainMenuScreen();
				break;
			}
			case STATE_LOBBY_HOST_PREFS: {
				this.currentScreen = new tfn.JoinPrefsScreen();
				break;
			}
			case STATE_LOBBY_HOST:
			case STATE_LOBBY_JOIN: {
				var isHost = (screenState == STATE_LOBBY_HOST);
				this.currentScreen = new tfn.LobbyScreen(isHost);
				break;
			}
			default: break;
		}
		
		this.currentScreenState = screenState;
		this.stage.addChild(this.currentScreen);
	}
}
