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
		
		this.healthBarChildIndex;
		this.player1ScoreChildIndex;
		this.player2ScoreChildIndex;
		this.player3ScoreChildIndex;
		this.player4ScoreChildIndex;
			
		// Set up a ticker to redraw on the tick interval.
		createjs.Ticker.addEventListener("tick", this.tick.bind(this));
	}
	
	this.createTanks = function() {
		this.physicalObjects = [
			new tfn.Tank(90, 90)
		];
		
		this.tank = this.physicalObjects[0];
		
		for (var i = 0; i < this.physicalObjects.length; i++) {
			this.addChild(this.physicalObjects[i]);
		}
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
		
		//Save New Index
		this.healthBarChildIndex = this.getChildIndex(bar);
	}
	
	this.updatePlayerScores = function(player1Score, player2Score, player3Score, player4Score) {
		this.player1ScoreLabel.text = player1Score.toString();
		this.player2ScoreLabel.text = player2Score.toString();
		this.player3ScoreLabel.text = player3Score.toString();
		this.player4ScoreLabel.text = player4Score.toString();
	}
	
	
	this.tick = function() {
		//this.tank.stop();
		
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
		
		var collisionDetector = new tfn.CollisionDetector(this.tank.getCollisionRect(), this.mapBitmap, "map");
		this.tank.setCollisions(collisionDetector.collisions);
		
		// Send a tick event to all of the physical objects we're
		// simulating.			
		for (var i = 0; i < this.physicalObjects.length; i++) {
			this.physicalObjects[i].tick(event);
		}
		
		
		game.stage.update(event);
	}
});
