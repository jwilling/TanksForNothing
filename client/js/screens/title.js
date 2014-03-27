game.TitleScreen = me.ScreenObject.extend({
	init : function() {
		// Call the parent initializer using the following parameters:
		//		addAsObject = true
		//		persist = false;
		this.parent(true, false);
		this.z = 0;
		
		// Set up a new sprite for the background image and
		// add it to the game object.
		this.background = new ImageSprite("Start_Menu");
		me.game.world.addChild(this.background);
		
		// Set up an event listener to jump to the menu screen
		// whenever a key is pressed.
		var keyPressedHandler = function(event) {
			// Change the state to the main menu.
			me.state.change(STATE_MAIN_MENU);
			window.removeEventListener('keydown', keyPressedHandler);
		}
		
		// Add the event listener.
		window.addEventListener('keydown', keyPressedHandler);
	},
	
	// Called when the screen is about to be destroyed.
	onDestroyEvent : function() {
		// Remove the background image sprite.
		me.game.world.removeChild(this.background);
	},
	
	// Override the canvas drawing.
	draw : function(context) {
		// Clear the canvas.
		me.video.clearSurface(context, "#000");
	 },
});
