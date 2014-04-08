tfn.Tank = tfn.PhysicalBitmap.fastClass(function(base, baseConstructor) {
	this.constructor = function(x, y) {
		var imageName = "tank-body-red";
		var maximumVelocity = 300;
		var frictionCoefficient = 0;
		var accelerationMagnitude = 500;
		
		baseConstructor.call(this, imageName, x, y, maximumVelocity, frictionCoefficient, accelerationMagnitude);
		
		this.tankVelocity = 250;
		this.setAnchorPoint(0.5, 0.5);
	}
	
	this.moveForward = function() {
		this.move(this.tankVelocity);
	}
	
	this.moveBackward = function() {
		this.move(-this.tankVelocity);
	}
	
	this.stop = function() {
		this.move(0);
	}
	
	this.move = function(velocity) {
		// Just apply a constant velocity relative to the timestep.
		var radians = this.rotation * (Math.PI / 180);
		var timestep = this.lastTimestep;
		
		var x = this.currentPosition.x + velocity * Math.cos(radians) * timestep;
		var y = this.currentPosition.y + velocity * Math.sin(radians) * timestep;
		
		this.setPosition(x, y);
	}

	this.tick = function() {		
		// We don't want to inherit any simulations from
		// the parent, so override this and keep it empty
		// except for the timestep calculation.
		this.performTimestep();
	}
	
	this.rotateRight = function() {
		this.rotation += this.lastTimestep * 200;
	}
	
	this.rotateLeft = function() {
		this.rotation -= this.lastTimestep * 200;
	}
	
	this.setCollisions = function(collisions) {
		if (collisions.LEFT || collisions.RIGHT) {
			this.setPosition(this.lastKnownSafePosition.x, this.currentPosition.y);
		} else if (collisions.TOP || collisions.BOTTOM) {
			this.setPosition(this.currentPosition.x, this.lastKnownSafePosition.y);
		}
		
		if (!collisions.COLLISION) {
			this.lastKnownSafePosition = this.currentPosition;
			this.lastKnownSafeRotation = this.rotation;
		}
	}
});
