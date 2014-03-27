var GameIsInSession = false;

game.PlayScreen = CustomScreen.extend({
	onResetEvent: function() {
		GameIsInSession = true;
		console.log("hey");
		//load level
		me.levelDirector.loadLevel("bloodGultch");
		
		// reset the score
		game.data.score = 0;
		
		// Create the tanks.
		this.createTanks();
		
		this.tank = new TankSprite(30, 30);
		this.tank.positionChangedHandler = function(x, y) {
			//console.log("moved: " + x + ", " + y);
		}
		me.game.world.addChild(this.tank);
		
		gameEnvUpdateCallback = updateEnvironment;
	},
	
	createTanks : function() {
		this.tanks = {};
		
		// Iterate over the players in the game environment (client.js).
		for (var playerID in gameEnv.players) {
			var player = gameEnv.players[playerID];
			
			// Create a new tank, associate it with the player, and
			// add it to the world.
			var tank = new TankSprite(player.locX, player.locY);
			this.tanks[playerID] = tank;
			me.game.world.addChild(tank);
		}
		
		// Store our tank.
		this.tank = tanks[myPlayerID];
	},
	
	updateEnvironment : function(gameEnv) {
		// Update the position of any tanks that aren't our own.
		// See client.js for gameEnv.
		for (var playerID in this.tanks) {
			if (playerID == myPlayerID) continue;
			
			var player = gameEnv.players[playerID];
			var tank = this.tanks[playerID];
			tank.moveToPoint(player.locX, player.locY);
		}		
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
		
		return true;
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
