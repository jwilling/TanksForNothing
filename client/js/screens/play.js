game.PlayScreen = me.ScreenObject.extend({
	init : function() {
		this.parent(true);

		// title screen image
		this.title = null;
	},
	 
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	

		// load a level
		//me.levelDirector.loadLevel("area01");

		// reset the score
		//game.data.score = 0;

		// add our HUD to the game world
		//this.HUD = new game.HUD.Container();
		//me.game.world.addChild(this.HUD);
		
		if (this.title == null) {
      	this.title = me.loader.getImage("playTestScreen");
      	}

	},

	
	// the main drawing function
	draw : function(context) {
		context.drawImage(this.title, 0,0);
		
	},
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		//me.game.world.removeChild(this.HUD);
	}
});