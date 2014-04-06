tfn.GameScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function() {
		baseConstructor.call(this);
		
		// Add a blank background image.
		var bitmap = this.addImage("background-blank", 0, 0);
		
		// Add the map image.
		this.mapBitmap = this.addImage("map-blue", 0, 0);
		
		// Create the tanks.
		this.createTanks();
		
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

	this.tick = function() {	
		var shouldAccelerate = game.isKeyPressed(KEY_W);
		this.tank.accelerate(shouldAccelerate);

		if (game.isKeyPressed(KEY_A)) {			
			this.tank.rotateLeft();
		}
		if (game.isKeyPressed(KEY_D)) {
			this.tank.rotateRight();
		}
		
		var collisionDetector = new tfn.CollisionDetector(this.tank, this.mapBitmap);
		this.tank.setCollisions(collisionDetector.collisions);
		
		// Send a tick event to all of the physical objects we're
		// simulating.			
		for (var i = 0; i < this.physicalObjects.length; i++) {
			this.physicalObjects[i].tick(event);
		}

		game.stage.update(event);
	}
});
