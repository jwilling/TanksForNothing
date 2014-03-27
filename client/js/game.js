var game = {
	// Run on page load.
	"onload" : function () {
		
		// Initialize the video.
		if (!me.video.init("screen", 1024, 768, true, 'auto')) {
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
		me.state.set(STATE_SPLASH_SCREEN, new game.TitleScreen());
		me.state.set(STATE_MAIN_MENU, new game.MainMenuScreen());
			
		// Show the splash screen.
		me.state.change(STATE_SPLASH_SCREEN);
	}
};
