var game = {
	// an object where to store game information
		data : {
			// score
			score : 0
		},
	
	// Run on page load.
	"onload" : function () {
		
		// Initialize the video.
		if (!me.video.init("screen", 1024, 768, true, window.devicePixelRatio, true)) {
			alert("Your browser does not support HTML5 canvas.");
			return;
		}
		
		// Set a callback to run when loading is complete.
		me.loader.onload = this.loaded.bind(this);

		// Load the resources.
		me.loader.preload(game.resources);

		// Initialize melonJS and display a loading screen.
		me.state.change(me.state.LOADING);
},

	// Run on game resources loaded.
	"loaded" : function () {
		// Associate the states with the screens.
		me.state.set(STATE_SPLASH, new game.TitleScreen());
		me.state.set(STATE_MAIN_MENU, new game.MainMenuScreen());
		me.state.set(STATE_GAME, new game.PlayScreen());
					
		// Show the splash screen.
		me.state.change(STATE_SPLASH);

		// Bind the keyboard presses to named events.
		me.input.bindKey(me.input.KEY.W, "up");
		me.input.bindKey(me.input.KEY.A, "left");
		me.input.bindKey(me.input.KEY.S, "down");
		me.input.bindKey(me.input.KEY.D, "right");
		me.input.bindKey(me.input.KEY.LEFT, "left_arrow");
		me.input.bindKey(me.input.KEY.RIGHT, "right_arrow");
	}
};
