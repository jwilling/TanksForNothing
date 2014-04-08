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
		createjs.Ticker.timingMode = createjs.Ticker.TICKER;
		createjs.Ticker.setFPS(60);

		// Set up our own tracking of key events.
		this.setupKeyTracking();
		
		// Start our game with the preloading screen.
		this.setScreenState(STATE_PRELOADING);
		
		// Call our tick function when the game tick occurs.
		createjs.Ticker.addEventListener("tick", this.tick.bind(this));
	},
	
	setupKeyTracking : function() {
		var keysPressed = {};
		this.keysPressed = keysPressed;
		
		document.onkeydown = function(event) {			
			keysPressed[event.which] = true;
		}
		
		document.onkeyup = function(event) {
			keysPressed[event.which] = false;
		}
	},
	
	isKeyPressed : function(key) {
		return this.keysPressed[key] || false;
	},
	
	tick : function(event) {
		// Make sure we have a valid initial tick time.
		if (this.lastTick < 0) {
			this.lastTick = createjs.Ticker.getTime();
		}
		
		// Calculate the delta since the last tick.
		var currentTime = createjs.Ticker.getTime();
		var timestep = (currentTime - this.lastTick) / 1000;
		this.lastTick = currentTime;
		tfn.lastTimestep = timestep;
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
			case STATE_COUNTDOWN: {
				this.currentScreen = new tfn.CountdownScreen();
				break;
			}
			case STATE_GAME: {
				this.currentScreen = new tfn.GameScreen();
				break;
			}
			default: break;
		}
		
		this.currentScreenState = screenState;
		this.stage.addChild(this.currentScreen);
		this.currentScreen.onDisplayHandler();
	}
}
