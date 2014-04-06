tfn.Tank = tfn.PhysicalBitmap.fastClass(function(base, baseConstructor) {
	this.constructor = function(x, y) {
		baseConstructor.call(this, "tank-body-red", x, y, 500);
		
		this.accelerationMagnitude = 200;
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
