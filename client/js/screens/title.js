game.TitleScreen = CustomScreen.extend({
	onResetEvent : function() {
		// Set up a new sprite for the background image and
		// add it to the game object.
		this.background = new ImageSprite("title-background", 0, 0);
		me.game.world.addChild(this.background);
		
		// Set up an event listener to jump to the menu screen
		// whenever a key is pressed or the mouse is clicked.
		this.finishHandler = function(event) {
			// Change the state to the main menu.
			me.state.change(STATE_MAIN_MENU);
		}
		
		// Add the event listeners.
		window.addEventListener('keydown', this.finishHandler);
		window.addEventListener('click', this.finishHandler);
	},
	
	// Called when the screen is about to be destroyed.
	onDestroyEvent : function() {
		// Remove the background image sprite.
		window.removeEventListener('keydown', this.finishHandler);
		window.removeEventListener('click', this.finishHandler);
		me.game.world.removeChild(this.background);
	},
});
