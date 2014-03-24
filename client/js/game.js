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

		// Load the resourcess.
		me.loader.preload(game.resources);

		// Initialize melonJS and display a loading screen.
		me.state.change(me.state.LOADING);
},

	// Run on game resources loaded.
	"loaded" : function () {
		me.state.set(me.state.MENU, new game.TitleScreen());
		// see here for more state: http://melonjs.github.io/docs/me.state.html

		// Show the title screen.
		me.state.change(me.state.MENU);
	}
};
