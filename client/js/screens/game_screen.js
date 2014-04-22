tfn.GameScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function() {
		baseConstructor.call(this);
				
		// Add a blank background image.
		var bitmap = this.addImage("background-blank", 0, 0);
		
		// Add the map image.
		this.mapBitmap = this.addImage("map-blue", 0, 0);
		
		this.playerColorMappings = {
			0: "red",
			1: "green",
			2: "orange",
			3: "yellow",
		};
		
		// Create the tanks.
		this.createTanks();
		
		//Health Bar
		this.createHUD();
		
		// Set up a ticker to redraw on the tick interval.
		createjs.Ticker.addEventListener("tick", this.tick.bind(this));
	}
	
	this.createTanks = function() {
		// A mapping for enemy bullets. The key is the player *number*,
		// and the value is the list of bullets (not shots!).
		this.displayedEnemyBullets = { };
		
		this.playerIDToTankMappings = { };
		
		// Iterate over the players.
		for (var key in gameEnv.players) {
			if (!gameEnv.players.hasOwnProperty(key)) continue;

			var player = gameEnv.players[key];
			this.displayedEnemyBullets[player.playerNum] = [];
			
			// Create a new tank, associate it with the player, and
			// add it as a child.			
			var colorName = this.playerColorMappings[player.playerNum];
			var tank = new tfn.Tank(player.locX, player.locY, colorName, player.playerNum);
			
			this.playerIDToTankMappings[player.playerID] = tank;
			
			this.addChild(tank);
		}
		
		// Keep a reference to our own tank.
		this.tank = this.playerIDToTankMappings[myPlayerID];
		
		// Keep track of when our tank state changes, and emit
		// this to the server so it can update the game environment.
		this.tank.stateChangedHandler = function(x, y, tankRotation, turretRotation) {
			updatePlayerPositionOnServer(x, y, tankRotation, turretRotation);
		}
		
		// Bind our handler to the tank for when we fire.
		this.tank.shouldFireHandler = this.ourTankShouldFire.bind(this);
		
		// Bind the update callback function from the client to
		// our update function.
		gameEnvUpdateCallback = this.updateGameEnvironment.bind(this);
		moveTankToCallback = this.moveTank.bind(this);
	}
	this.moveTank = function(data){
		this.tank.setPosition(data.locX, data.locY);
	}	
	this.ourTankShouldFire = function(startingX, startingY, angle, playerNumber) {
		var colorName = this.playerColorMappings[playerNumber];
		var bullet = new tfn.Bullet(startingX, startingY, angle, colorName);
		this.addChild(bullet);
	}
	
	this.createHUD = function() {
		// Create information labels.
		this.healthLabel = this.addLabel("Health:", "20px Futura", "white", 300, 743);
		this.scoreLabel = this.addLabel("Scores", "20px Futura", "white", 480, 4);
		
		// Create the score labels.
		this.player1ScoreLabel = this.addLabel("", "20px Futura", "red", 150, 4);
		this.player2ScoreLabel = this.addLabel("", "20px Futura", "green", 300, 4);
		this.player3ScoreLabel = this.addLabel("", "20px Futura", "orange", 710, 4);
		this.player4ScoreLabel = this.addLabel("", "20px Futura", "yellow", 860, 4);
		
		// Add the score labels to an array so we can associate
		// it with the player number by index.
		this.playerScoreLabels = [ this.player1ScoreLabel, this.player2ScoreLabel, this.player3ScoreLabel, this.player4ScoreLabel ];

		// Add the health bar.
		this.updateHealth(100);
		this.lastDrawnHealth = 100;
	}
	
	this.updateHealth = function(health) {
		if (health == this.lastDrawnHealth) {
			return;
		}
		
		this.lastDrawnHealth = health;
		this.removeChild(this.healthBar);
		
		// Create a new health bar.
		var drawnHealth = new createjs.Graphics();
		
		drawnHealth.setStrokeStyle(1);
		drawnHealth.beginStroke(createjs.Graphics.getRGB(0,255,0));
		drawnHealth.beginFill(createjs.Graphics.getRGB(0,255,0));
		drawnHealth.drawRect(100, 100, health, 20);
		
		this.healthBar = new createjs.Shape(drawnHealth);
		this.healthBar.x = 365;
		this.healthBar.y = 645;
		
		//Add it
		this.addChild(this.healthBar);
	}
	
	this.updatePlayerScores = function(player1Score, player2Score, player3Score, player4Score) {
		this.player1ScoreLabel.text = player1Score.toString();
		this.player2ScoreLabel.text = player2Score.toString();
		this.player3ScoreLabel.text = player3Score.toString();
		this.player4ScoreLabel.text = player4Score.toString();
	}
	
	this.tick = function() {
		// Save the current collision rect of the tank for later
		// collision checking.		
		var previousTankCollisionRect = this.tank.getCollisionRect();
		
		// Move the tank if needed.
		this.tank.resetVelocity();
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
		
		var collisionDetector = new tfn.CollisionDetector(this.mapBitmap, "map");
		var safeTankRect = collisionDetector.determineOpenRect(this.tank.getCollisionRect(), previousTankCollisionRect);
		this.tank.setPosition(safeTankRect.x, safeTankRect.y);
		this.tank.setTankRotation(safeTankRect.rotation);
		
		// Send a tick event to all of the physical objects we're
		// simulating.
		var ourBullets = [];
		for (var i = 0; i < this.getNumChildren(); i++) {
			var object = this.getChildAt(i);
			if (object instanceof tfn.PhysicalBitmap) {
				object.tick(event);
			}
			
			if (object instanceof tfn.Bullet) {
				ourBullets.push(object);
			}
		}
		
		this.emitBulletPositions(ourBullets);
		this.checkForBulletHits(ourBullets);

		game.stage.update();
	}
	
	this.updateGameEnvironment = function(env) {
		// Iterate over the players
		for (var key in env.players) {
			if (!gameEnv.players.hasOwnProperty(key)) continue;	
			var player = gameEnv.players[key];

			// We don't want to update our own position from the server,
			// so update our score-related values and continue.
			if (player.playerID == myPlayerID) {
				this.updateHealth(player.HP);
				this.playerScoreLabels[player.playerNum].text = player.kills;
				continue;
			};
			
			var tank = this.playerIDToTankMappings[player.playerID];
			tank.setPosition(player.locX, player.locY);
			tank.setTankRotation(player.bodyDirection);
			tank.setTurretRotation(player.turretDirection);
			
			// Update the player's score.
			var playerScoreLabel = this.playerScoreLabels[player.playerNum];
			playerScoreLabel.text = player.kills;
			
			// Update the (fake) bullets on the screen for the current
			// player and state.
			this.updateEnemyBullets(env.shots[player.playerID], player.playerNum);
		}
	}
	
	this.emitBulletPositions = function(ourBullets) {
		var shots = [];
		for (var i = 0; i < ourBullets.length; i++) {
			var currentPosition = ourBullets[i].currentPosition;
			shots.push(new Shot(myPlayerID, currentPosition.x, currentPosition.y));
		}
				
		updateShots(shots);
	}
	
	this.updateEnemyBullets = function(shots, playerNum) {		
		if (typeof this.displayedEnemyBullets.playerNum !== undefined) {
			var existingBullets = this.displayedEnemyBullets[playerNum];
		
			for (var i = 0; i < existingBullets.length; i++) {
				this.removeChild(existingBullets[i]);
			}
		}

		this.displayedEnemyBullets[playerNum] = [];
		shots = shots || [];
		
		// Construct new bullets for the shots and add them to our container.
		for (var i = 0; i < shots.length; i++) {
			var colorName = this.playerColorMappings[playerNum];
			var image = tfn.preloader.getResult("tank-bullet-" + colorName);
			var bitmap = new createjs.Bitmap(image);
			
			bitmap.x = shots[i].locX;
			bitmap.y = shots[i].locY;
			
			// TODO: resX/Y?
			this.addChild(bitmap);
			this.displayedEnemyBullets[playerNum].push(bitmap);
		}
	}
	
	this.checkForBulletHits = function(ourBullets) {
		// Check all of the other tanks on the screen
		// other than our own to see if we have a collision.
		for (var playerID in this.playerIDToTankMappings) {				
			if (!this.playerIDToTankMappings.hasOwnProperty(playerID)) continue;
			if (myPlayerID == playerID) continue;
			
			var tank = this.playerIDToTankMappings[playerID];
			var collisionRect = tank.getCollisionRect();
			
			// Loop over all of the bullets to see if they intersect
			// the collision rect of the tank.
			for (var i = 0; i < ourBullets.length; i++) {
				var bullet = ourBullets[i];
				var point = new tfn.Point(bullet.currentPosition.x, bullet.currentPosition.y);
				
				if (collisionRect.containsPoint(point)) {
					bullet.kill();
					playerHit(playerID);
				}
			}
		}
	}
});
