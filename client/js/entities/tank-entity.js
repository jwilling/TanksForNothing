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
		
		this.collidable = false;
	},
	
	update : function() {
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
		
		if (newPositionX != this.x || newPositionY != this.y) {
			this.moveToPoint(newPositionX, newPositionY);
		}
		
		return this.parent();
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
		this.parent("tank-body-red", x, y, 3);
		this.movingRight = false;
		this.movingLeft = false;
		this.movingUp = false;
		this.movingDown = false;
		
		// Create a new sprite which is used as a turret.
		this.turretSprite = new ImageSprite("tank-turret-red", 0, 0);
		
		// The anchor point should be specified in such a way
		// as to allow the rotation to occur around the center of the
		// tank. This was fudged until it looked right.
		this.turretSprite.setAnchorPoint(0.2, 0.5);
		me.game.world.addChild(this.turretSprite);
		
		// Move the turret to the initial position.
		this.turretSprite.moveToPoint(this.x, this.y);
		
		// The callback for whenever the position or turret
		// rotation changes.
		this.changeHandler = function(x, y, rotation, turretRotation) {};
		
		this.positionChangedHandler = function(x, y) {
			this.changeHandler(this.x, this.y, this.rotation, this.turretSprite.rotation);
		};
	},
	
	moveToPoint : function(x, y) {
		this.parent(x, y);
		
		// When we move, move the turret too!
		//
		// The offsets from the x and y coordinates
		// were fudged. Because of the blur on the sprites
		// it is extremely difficult to get the right origin
		// for the tanks. TODO: make this better!
		var turretX = x + 43;
		var turretY = y + 15;
		this.turretSprite.moveToPoint(turretX, turretY);
	},
	
	setMovingRight : function(moving) {
		this.movingRight = moving;
		this.updateState();
	},
	
	setMovingLeft : function(moving) {
		this.movingLeft = moving;
		this.updateState();
	},
	
	setMovingUp : function(moving) {
		this.movingUp = moving;
		this.updateState();
	},
	
	setMovingDown : function(moving) {
		this.movingDown = moving;
		this.updateState();
	},
	
	setRotatingTurretRight : function(rotating) {
		if (rotating) {
			this.turretSprite.setRotation(this.turretSprite.rotation + 2);
		}
	},
	
	setRotatingTurretLeft : function(rotating) {
		if (rotating) {
			this.turretSprite.setRotation(this.turretSprite.rotation - 2);
		}
	},
	
	updateState : function() {
		this.setAccelerationX(this.movingRight ? 1 : (this.movingLeft ? -1 : 0));
		this.setAccelerationY(this.movingDown ? 1 : (this.movingUp ? -1 : 0));
		
		this.updateRotation();
	},
	
	updateRotation : function() {		
		if (this.movingUp && this.movingRight || this.movingDown && this.movingLeft) {
			this.setRotation(-45);
		} else if (this.movingUp && this.movingLeft || this.movingDown && this.movingRight) {
			this.setRotation(45);
		} else if (this.movingUp || this.movingDown) {
			this.setRotation(90);
		} else if (this.movingRight || this.movingLeft) {
			this.setRotation(0);
		}
	},
	
	setTurretRotation : function(angle) {
		if (this.turretSprite.rotation != angle) {
			this.turretSprite.setRotation(angle);
			this.changeHandler(this.x, this.y, this.rotation, this.turretSprite.rotation);
		}
	},
	
	update : function() {
		return this.parent();
	},
	
	destroy : function() {
		this.parent();
		
		me.game.world.removeChild(this.turretSprite);
	},
});
