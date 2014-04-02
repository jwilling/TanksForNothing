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
	},
}
