var PhysicalSprite = ImageSprite.extend({
	init : function(imageName, x, y, maximumVelocity) {
		this.parent(imageName, x, y);
		
		// The maximum velocity that the tank can move at.
		this.maxVelocityX = maximumVelocity;
		this.maxVelocityY = maximumVelocity;
		
		// Start the current velocity at 0.
		this.currentVelocityX = 0;
		this.currentVelocityY = 0;
		
		// Start the acceleration at 0.
		this.accelerationX = 0;
		this.accelerationY = 0;
		
		this.collidable = true;
	},
	
	update : function() {
		this.parent();
		
		var timestep = me.timer.tick;
				
		// Calculate the velocity for the entity. Also cap the
		// velocity to the max velocity.
		//
		// v = v0 + at.
		var newVelocityX = Math.min(this.currentVelocityX + this.accelerationX * timestep, this.maxVelocityX);
		var newVelocityY = Math.min(this.currentVelocityY + this.accelerationY * timestep, this.maxVelocityY);
		newVelocityX = Math.min(Math.max(newVelocityX, -this.maxVelocityX), this.maxVelocityX)
		newVelocityY = Math.min(Math.max(newVelocityY, -this.maxVelocityY), this.maxVelocityY)
		
		// Apply a linear damping.
		//var dampingX = (1 - Math.abs(this.accelerationX)) * this.frictionCoefficient;
		//newVelocityX = newVelocityX + (newVelocityX < 0 ? dampingX : -dampingX);
		
		// TODO: for now, just make velocity 0 when acceleration
		// is 0. Later actually apply the damping!
		if (this.accelerationX == 0) {
			newVelocityX = 0;
		}
		if (this.accelerationY == 0) {
			newVelocityY = 0;
		}
		
		// Calculate the displacement.
		//
		// x = vt.
		var displacementX = newVelocityX * timestep;
		var displacementY = newVelocityY * timestep;
		var newPositionX = this.x + displacementX;
		var newPositionY = this.y + displacementY;
						
		this.currentVelocityX = newVelocityX;
		this.currentVelocityY = newVelocityY;
		
		this.moveToPoint(newPositionX, newPositionY);
	},
	
	draw : function(context) {
		this.parent(context);
		
		context.fillStyle = "rgba(0, 0, 200, 0.2)";
		context.fillRect(this.x, this.y, this.width, this.height);
	},
	
	// Acceleration is a number from 0 - 1.
	setAccelerationX : function(accelX) {
		this.accelerationX = accelX;
	},
	
	setAccelerationY : function(accelY) {
		this.accelerationY = accelY;
	},
});

var TankSprite = PhysicalSprite.extend({
	init : function(x, y) {
		this.parent("tank-body-red", x, y, 2);
	}
});
