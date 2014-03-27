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

var idToSprite = {}; //map playerID to playerSprite; var spriteObject = idToSprite[playerID]




function updateGameEnvironment(gameEnv) {
	for (var playerName in gameEnv.players) {
		if(playerName != myPlayerID) {
			var player = gameEnv.players[playerName];
			
			var spriteObject = idToSprite[playerName];
			
			spriteObject.moveToPoint(player.locX, player.locY);
			spriteObject.bodyTurretRotation(player.bodyDirection, player.turretDirection);
		}
	}
	
};
