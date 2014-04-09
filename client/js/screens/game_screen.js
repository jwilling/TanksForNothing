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
		
		//Health Bar
		var healthBar = new createjs.Graphics();
		
		healthBar.setStrokeStyle(1);
		healthBar.beginStroke(createjs.Graphics.getRGB(0,255,0));
		healthBar.beginFill(createjs.Graphics.getRGB(0,255,0));
		healthBar.drawRect(100,100,100,20);
		
		var bar = new createjs.Shape(healthBar);
		bar.x = 363;
		bar.y = 645;
		
		//Health Bar Outline
		var hBarOutline = new createjs.Graphics();
		
		hBarOutline.setStrokeStyle(3);
		hBarOutline.beginStroke(createjs.Graphics.getRGB(0,255,0));
		hBarOutline.beginFill(null);
		hBarOutline.drawRect(100,100,100,20);
		
		var barOutline = new createjs.Shape(hBarOutline);
		barOutline.x = 363;
		barOutline.y = 645;
		
		//Text displayed on HUD
		var healthText = new createjs.Text("Health:", "20px Arial", "white");
		healthText.textBasline = "alphabetic";
		healthText.x = 300;
		healthText.y = 743;
		
		var scoreWord = new createjs.Text("Scores", "20px Arial", "white");
		scoreWord.textBasline = "alphabetic";
		scoreWord.x = 480;
		scoreWord.y = 5;
		
		var player1ScoreText = new createjs.Text("0", "20px Arial", "red");
		player1ScoreText.textBasline = "alphabetic";
		player1ScoreText.x = 150;
		player1ScoreText.y = 5;
		
		var player2ScoreText = new createjs.Text("0", "20px Arial", "yellow");
		player2ScoreText.textBasline = "alphabetic";
		player2ScoreText.x = 300;
		player2ScoreText.y = 5;
		
		var player3ScoreText = new createjs.Text("0", "20px Arial", "green");
		player3ScoreText.textBasline = "alphabetic";
		player3ScoreText.x = 710;
		player3ScoreText.y = 5;
		
		var player4ScoreText = new createjs.Text("0", "20px Arial", "white");
		player4ScoreText.textBasline = "alphabetic";
		player4ScoreText.x = 860;
		player4ScoreText.y = 5;
		
		//Adding children to screen
		this.addChild(barOutline);
		this.addChild(healthText);
		this.addChild(scoreWord);
		this.addChild(player1ScoreText);
		this.addChild(player2ScoreText);
		this.addChild(player3ScoreText);
		this.addChild(player4ScoreText);
		this.addChild(bar);
		
		//Keep track on index in child array
		this.healthBarChildIndex = this.getChildIndex(bar);
		this.player1ScoreChildIndex = this.getChildIndex(player1ScoreText);
		this.player2ScoreChildIndex = this.getChildIndex(player2ScoreText);
		this.player3ScoreChildIndex = this.getChildIndex(player3ScoreText);
		this.player4ScoreChildIndex = this.getChildIndex(player4ScoreText);

	}
	
	this.updateHealth = function(health) {
		this.removeChildAt(this.healthBarChildIndex);
		
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
		this.getChildAt(this.player1ScoreChildIndex).text = player1Score.toString();
		this.getChildAt(this.player2ScoreChildIndex).text = player2Score.toString();
		this.getChildAt(this.player3ScoreChildIndex).text = player3Score.toString();
		this.getChildAt(this.player4ScoreChildIndex).text = player4Score.toString();
	}
	
	
	this.tick = function() {
		//this.tank.stop();
		
		if (game.isKeyPressed(KEY_W)) {
			this.tank.moveForward();
			this.updateHealth(50);
			this.updatePlayerScores(1,2,3,4);
		}
		if (game.isKeyPressed(KEY_S)) {
			this.tank.moveBackward();
			this.updateHealth(25);
			this.updatePlayerScores(4,3,2,1);

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
