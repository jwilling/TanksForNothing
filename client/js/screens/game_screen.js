tfn.GameScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function() {
		baseConstructor.call(this);
		
		// Add a blank background image.
		var bitmap = this.addImage("background-blank", 0, 0);
		
		// Add the map image.
		this.mapBitmap = this.addImage("map-blue", 0, 0);
		
				
		var bitmap = new tfn.PhysicalBitmap("tank-body-red", 0, 0, 500);
		this.addChild(bitmap);

		this.physicalObjects = [
			bitmap
		];
		
		this.tank = bitmap;
		this.tank.setAnchorPoint(0.5, 0.5);
				
		var me = this;
		createjs.Ticker.addEventListener("tick", this.tick.bind(this));
		
		setInterval(this.checkCollisions.bind(this), 500);
	}

	this.tick = function() {
		// Default acceleration to 0, 0.
		this.tank.setAcceleration(0, 0);
	
		if (game.isKeyPressed(KEY_W)) {
			var radians = this.tank.rotation * (Math.PI / 180);
			var acceleration = 200;
			var x = acceleration * (Math.cos(radians));
			var y = acceleration * (Math.sin(radians));
		
			this.tank.setAcceleration(x, y);
		}
		if (game.isKeyPressed(KEY_A)) {			
			this.tank.rotation -= 4;
		}
		if (game.isKeyPressed(KEY_D)) {
			this.tank.rotation += 4;
		}
		
		// Send a tick event to all of the physical objects we're
		// simulating.			
		for (var i = 0; i < this.physicalObjects.length; i++) {
			this.physicalObjects[i].tick(event);
		}
		
		game.stage.update(event);
	}
	
	this.checkCollisions = function() {
		ndgmr.DEBUG = true;
		var collisionIntersection = ndgmr.checkPixelCollision(this.tank, this.mapBitmap, 1, false);
		if (collisionIntersection) {

		} else {
			console.log("no collision");
			this.lastSafeX = this.tank.x;
			this.lastSafeY = this.tank.y;
			return;
		}
		
		var savedX = this.tank.x;
		var savedY = this.tank.y;
		
		// First test moving on the x axis.
		this.tank.x = this.lastSafeX;
		var collisionX = false;
		var collisionY = false;
		if (!ndgmr.checkPixelCollision(this.tank, this.mapBitmap, 1, false)) {
			collisionX = true;
			console.log("we collided on x!");
		}
	}
});
