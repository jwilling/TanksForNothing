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
		if (shouldAccelerate) {
			var radians = this.rotation * (Math.PI / 180);
			var x = this.accelerationMagnitude * (Math.cos(radians));
			var y = this.accelerationMagnitude * (Math.sin(radians));

			this.setAcceleration(x, y);
		} else {
			this.setAcceleration(0, 0);
		}
	}
	
	this.rotateRight = function() {
		this.rotation += 3;
	}
	
	this.rotateLeft = function() {
		this.rotation -= 3;
	}
});
