var idToSprite = {};

game.PlayScreen = CustomScreen.extend({
	onResetEvent: function() {

		// Load the level.
		me.levelDirector.loadLevel("bloodGultch");
		
		// Reset the score.
		game.data.score = 0;
		
		// Create the tanks.
		this.createTanks();
		
		// Set up a callback for when the environment is updated.
		gameEnvUpdateCallback = this.updateEnvironment;
	},
	tanks: {},
	createTanks : function() {		
		
		// Iterate over the players in the game environment (client.js).
		for (var key in gameEnv.players) {
			if (!gameEnv.players.hasOwnProperty(key)) continue;
			
			var player = gameEnv.players[key];
			
			// Create a new tank, associate it with the player, and
			// add it to the world.
			var tank = new TankSprite(player.locX, player.locY);
			idToSprite[player.playerID] = tank;
			me.game.world.addChild(tank);
		}
		console.log("gameEnv:" + JSON.stringify(gameEnv));
		console.log("Session:" + JSON.stringify(session));
		
		this.tank = idToSprite[myPlayerID];
		this.tank.positionChangedHandler = function(x, y) {
			// Forward this onto the client to hand on to the server.
			updatePlayerLocationOnServer(x, y);
		};
	},
	
	updateEnvironment : function(gameEnv) {
		// Update the position of any tanks that aren't our own.
		// See client.js for gameEnv.
		for (var playerID in idToSprite) {
			if (playerID == myPlayerID) continue;
			console.log("updating opponent player");
			var player = gameEnv.players[playerID];
			var tank = idToSprite[playerID];
			tank.moveToPoint(player.locX, player.locY);
		}		
	},
	
	update : function() {
		// Set the appropriate movement on the tank by interpreting
		// the currently-pressed keys.
		
		this.tank.setMovingRight(me.input.isKeyPressed('right'));
		this.tank.setMovingLeft(me.input.isKeyPressed('left'));
		this.tank.setMovingDown(me.input.isKeyPressed('down'));
		this.tank.setMovingUp(me.input.isKeyPressed('up'));
		
		this.tank.setRotatingTurretRight(me.input.isKeyPressed('right_arrow'));
		this.tank.setRotatingTurretLeft(me.input.isKeyPressed('left_arrow'));
		// We don't want to cause a full redraw, so return false.
		//
		// The sprites will trigger their own drawing updates if
		// they need them.
		return false;
	},

	onDestroyEvent: function() {
		
	}
});

function updateGameEnvironment(gameEnv) {
	console.log("Updating game environment");
	for (var playerName in gameEnv.players) {
		if(playerName != myPlayerID) {
			var player = gameEnv.players[playerName];
			var spriteObject = idToSprite[playerName];

			spriteObject.moveToPoint(player.locX, player.locY);
			// TODO: change turret and body direction.
			//spriteObject.bodyTurretRotation(player.bodyDirection, player.turretDirection);
		}
	}
	
};
