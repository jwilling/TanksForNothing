(function() {
	var Tank = function(x, y) {
		this.initialize(x, y);
	}
	var prototype = new createjs.Container();
	Tank.prototype = prototype;
	Tank.prototype.container_initialize = prototype.initialize;
	
	Tank.prototype.initialize = function(x, y) {
		this.container_initialize();
				
		// Define empty callback functions that the parent can
		// override to get state change callbacks.
		this.stateChangedHandler = function(x, y, tankRotation, turretRotation) {};
		this.shouldFireHandler = function(startingX, startingY, angle) {};
				
		this.rotationalVelocity = 200;
		this.initializeTank();
		this.initializeTurret();
		this.setPosition(x, y);
	}
	
	Tank.prototype.initializeTank = function() {
		var tankImage = tfn.preloader.getResult("tank-body-red");
		this.tankBody = new createjs.Bitmap(tankImage);
		this.tankBody.regX = 0.5 * tankImage.width;
		this.tankBody.regY = 0.5 * tankImage.height;
		this.tankVelocity = 250;
		this.tankAnchorPoint = new tfn.Vector2D(0.5, 0.5);
		
		this.addChild(this.tankBody);
	}
	
	Tank.prototype.initializeTurret = function() {
		var turretImage = tfn.preloader.getResult("tank-turret-red");
		this.turret = new createjs.Bitmap(turretImage);
		this.turret.regX = 0.22 * turretImage.width;
		this.turret.regY = 0.5 * turretImage.height;
		
		this.addChild(this.turret);
	}

	Tank.prototype.tick = function() {
		
	}
	
	Tank.prototype.moveForward = function() {
		this.move(this.tankVelocity);
	}
	
	Tank.prototype.moveBackward = function() {
		this.move(-this.tankVelocity);
	}
	
	Tank.prototype.move = function(velocity) {
		// Just apply a constant velocity relative to the timestep.
		var radians = this.tankBody.rotation * (Math.PI / 180);
		var timestep = tfn.lastTimestep;
				
		var x = this.currentPosition.x + velocity * Math.cos(radians) * timestep;
		var y = this.currentPosition.y + velocity * Math.sin(radians) * timestep;
		
		this.setPosition(x, y);
	}
	
	Tank.prototype.setPosition = function(x, y) {
		this.tankBody.x = x;
		this.tankBody.y = y;
		this.turret.x = x;
		this.turret.y = y;
		
		this.currentPosition = new tfn.Vector2D(x, y);
		this.stateChangedHandler(x, y, this.tankBody.rotation, this.turret.rotation);
	}

	Tank.prototype.getCollisionRect = function() {
		return new tfn.Rect(
			this.currentPosition.x, 
			this.currentPosition.y, 
			this.tankBody.image.width, 
			this.tankBody.image.height, 
			this.tankBody.rotation, 
			this.tankAnchorPoint
		);
	}
	
	Tank.prototype.rotateLeft = function() {
		this.rotateChild(this.tankBody, -tfn.lastTimestep * this.rotationalVelocity);
	}
	
	Tank.prototype.rotateRight = function() {
		this.rotateChild(this.tankBody, tfn.lastTimestep * this.rotationalVelocity);
	}
	
	Tank.prototype.rotateTurretLeft = function() {
		this.rotateChild(this.turret, -tfn.lastTimestep * this.rotationalVelocity);
	}
	
	Tank.prototype.rotateTurretRight = function() {
		this.rotateChild(this.turret, tfn.lastTimestep * this.rotationalVelocity);
	}
	
	Tank.prototype.rotateChild = function(child, amount) {
		child.rotation += amount;
		this.stateChangedHandler(this.tankBody.x, this.tankBody.y, this.tankBody.rotation, this.turret.rotation);
	}
	
	Tank.prototype.setCollisions = function(collisions) {	
		
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
	
	tfn.Tank = Tank;
})();
