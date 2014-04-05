tfn.GameScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function() {
		baseConstructor.call(this);
		
		// Add a blank background image.
		var bitmap = this.addImage("background-blank", 0, 0);
		
		// TODO: load map.
				
		var bitmap = new tfn.PhysicalBitmap("tank-body-red", 0, 0, 500);
		this.addChild(bitmap);

		this.physicalObjects = [
			bitmap
		];
		
		this.tank = bitmap;
		this.tank.regX = this.tank.image.width / 2;
		this.tank.regY = this.tank.image.height / 2;
		
		var me = this;
		createjs.Ticker.addEventListener("tick", function(event) {
			me.tick();
		});
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
});
