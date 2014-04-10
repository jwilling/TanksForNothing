playerIDToTankMappings = {}
tfn.GameScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function() {
		baseConstructor.call(this);
		
		// Add a blank background image.
		var bitmap = this.addImage("background-blank", 0, 0);
		
		// Add the map image.
		this.mapBitmap = this.addImage("map-blue", 0, 0);
		
		// Create the tanks.
		this.createTanks();
		
		//Health Bar
		this.createHUD();
		
		// Set up a ticker to redraw on the tick interval.
		createjs.Ticker.addEventListener("tick", this.tick.bind(this));
	}
	this.createTanks = function() {
		// Create a mapping from player IDs to tank sprites.
		//this.playerIDToTankMappings = {};
		
		// Iterate over the players
		for (var key in gameEnv.players) {
			if (!gameEnv.players.hasOwnProperty(key)) continue;
			console.log(gameEnv);
			var player = gameEnv.players[key];
			
			// Create a new tank, associate it with the player, and
			// add it as a child.
			var tank = new tfn.Tank(player.locX, player.locY);
			playerIDToTankMappings[player.playerID] = tank;
			this.addChild(tank);
		}
		
		// Keep a reference to our own tank.
		this.tank = playerIDToTankMappings[myPlayerID];
		
		// Keep track of when our tank state changes, and emit
		// this to the server so it can update the game environment.
		this.tank.stateChangedHandler = function(x, y, tankRotation, turretRotation) {
			updatePlayerPositionOnServer(x, y, tankRotation, turretRotation);
		}
		
		var me = this;
		this.tank.shouldFireHandler = function(startingX, startingY, angle) {
			var bullet = new tfn.Bullet(startingX, startingY, angle);
			me.addChild(bullet);
		}
		
		gameEnvUpdateCallback = this.updateGameEnvironment;
	}
	
	this.createHUD = function() {
		//Text displayed on HUD
		this.healthLabel = this.addLabel("Health:", "20px Futura", "white", 300, 743);
		this.scoreLabel = this.addLabel("Scores", "20px Futura", "white", 480, 4);
		this.player1ScoreLabel = this.addLabel("1", "20px Futura", "red", 150, 4);
		this.player2ScoreLabel = this.addLabel("2", "20px Futura", "yellow", 300, 4);
		this.player3ScoreLabel = this.addLabel("3", "20px Futura", "green", 710, 4);
		this.player4ScoreLabel = this.addLabel("4", "20px Futura", "white", 860, 4);

		// Add the health bar.
		this.updateHealth(100);
	}
	
	this.updateHealth = function(health) {
		this.removeChild(this.healthBar);
		
		//Create New Bar
		var healthBar = new createjs.Graphics();
		
		healthBar.setStrokeStyle(1);
		healthBar.beginStroke(createjs.Graphics.getRGB(0,255,0));
		healthBar.beginFill(createjs.Graphics.getRGB(0,255,0));
		healthBar.drawRect(100,100,health,20);
		
		var bar = new createjs.Shape(healthBar);
		bar.x = 365;
		bar.y = 645;
		
		//Add it
		this.addChild(bar);
	}
	
	this.updatePlayerScores = function(player1Score, player2Score, player3Score, player4Score) {
		this.player1ScoreLabel.text = player1Score.toString();
		this.player2ScoreLabel.text = player2Score.toString();
		this.player3ScoreLabel.text = player3Score.toString();
		this.player4ScoreLabel.text = player4Score.toString();
	}
	
	this.tick = function() {
		if (game.isKeyPressed(KEY_W)) {
			this.tank.moveForward();
		}
		if (game.isKeyPressed(KEY_S)) {
			this.tank.moveBackward();
		}
		if (game.isKeyPressed(KEY_A)) {
			this.tank.rotateLeft();
		}
		if (game.isKeyPressed(KEY_D)) {
			this.tank.rotateRight();
		}
		if (game.isKeyPressed(KEY_LEFT)) {
			this.tank.rotateTurretLeft();
		}
		if (game.isKeyPressed(KEY_RIGHT)) {
			this.tank.rotateTurretRight();
		}
		if (game.isKeyPressed(KEY_SPACE)) {
			this.tank.fire();
		}
		
		var collisionDetector = new tfn.CollisionDetector(this.tank.getCollisionRect(), this.mapBitmap, "map");
		this.tank.setCollisions(collisionDetector.collisions);
		
		// Send a tick event to all of the physical objects we're
		// simulating.	
		for (var i = 0; i < this.getNumChildren(); i++) {
			if (this.getChildAt(i) instanceof tfn.PhysicalBitmap) {
				this.getChildAt(i).tick(event);
			}
		}

		game.stage.update();
	}
	var me = this;
	this.updateGameEnvironment = function(env) {
		console.log("updating env");
		// Iterate over the players
		for (var key in env.players) {
			if (!gameEnv.players.hasOwnProperty(key)) continue;	
			var player = gameEnv.players[key];
			console.log(env.players[key]);
			// We don't want to update our own position from the server.
			if (player.playerID == myPlayerID) continue;
			var tank = playerIDToTankMappings[player.playerID];
			tank.setPosition(player.locX, player.locY);
			tank.setTankRotation(player.bodyDirection);
			tank.setTurretRotation(player.turretDirection);
		}
	}
});
