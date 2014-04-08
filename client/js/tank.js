tfn.Tank = tfn.PhysicalBitmap.fastClass(function(base, baseConstructor) {
	this.constructor = function(x, y) {
		var imageName = "tank-body-red";
		var maximumVelocity = 300;
		var frictionCoefficient = 0;
		var accelerationMagnitude = 500;
		
		baseConstructor.call(this, imageName, x, y, maximumVelocity, frictionCoefficient, accelerationMagnitude);
		
		this.setAnchorPoint(0.5, 0.5);
	}
	
	this.accelerate = function(shouldAccelerate) {
		// Just apply a constant velocity relative to the timestep.
		var velocity = (shouldAccelerate ? 200 : 0);
		var timestep = this.performTimestep();

		var radians = this.rotation * (Math.PI / 180);
		var x = this.currentPosition.x + velocity * Math.cos(radians) * timestep;
		var y = this.currentPosition.y + velocity * Math.sin(radians) * timestep;
		
		this.setPosition(x, y);
	}

	this.tick = function() {
		// We don't want to inherit any simulations from
		// the parent, so override this and keep it empty.
	}
	
	this.rotateRight = function() {
		this.rotation += this.lastTimestep * 200;
	}
	
	this.rotateLeft = function() {
		this.rotation -= this.lastTimestep * 200;
	}
});
