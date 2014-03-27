game.PlayScreen = CustomScreen.extend({
	onResetEvent: function() {
		
		//load level
		me.levelDirector.loadLevel("area01");
		
		// reset the score
		game.data.score = 0;
		
		this.tank = new TankSprite(30, 30);
		this.tank.positionChangedHandler = function(x, y) {
			console.log("moved: " + x + ", " + y);
		}
		me.game.world.addChild(this.tank);
	},
	
	update : function() {
		this.tank.setAccelerationX(0);
		this.tank.setAccelerationY(0);
			
		if (me.input.isKeyPressed('left')) {
			this.tank.setAccelerationX(-1);
		}
		if (me.input.isKeyPressed('right')) {
			this.tank.setAccelerationX(1);
		}
		if (me.input.isKeyPressed('up')) {
			this.tank.setAccelerationY(-1);
		}
		if (me.input.isKeyPressed('down')) {
			this.tank.setAccelerationY(1);
		}
	},

	onDestroyEvent: function() {
		
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
