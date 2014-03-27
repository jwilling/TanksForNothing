game.PlayScreen = CustomScreen.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		
		//load level
		me.levelDirector.loadLevel("area01");
		
		// reset the score
		game.data.score = 0;
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	}
});
