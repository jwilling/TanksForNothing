(function() {
	var Tank = function(x, y, colorName, playerNumber) {
		this.initialize(x, y, colorName, playerNumber);
	}
	var prototype = new createjs.Container();
	Tank.prototype = prototype;
	Tank.prototype.container_initialize = prototype.initialize;
	
	Tank.prototype.initialize = function(x, y, colorName, playerNumber) {
		console.log(colorName);
		this.container_initialize();
		
		this.colorName = colorName;
		this.playerNumber = playerNumber;
				
		// Define empty callback functions that the parent can
		// override to get state change callbacks.
		this.stateChangedHandler = function(x, y, tankRotation, turretRotation) {};
		this.shouldFireHandler = function(startingX, startingY, angle) {};
		this.lastPlayerShot = Date.now();
				
		this.currentVelocity = new tfn.Vector2D(0, 0);
		this.rotationalVelocity = 200;
		this.initializeTank();
		this.initializeTurret();
		this.setPosition(x, y);
	}
	
	Tank.prototype.initializeTank = function() {			
		var tankImage = tfn.preloader.getResult("tank-body-" + this.colorName);
		this.tankBody = new createjs.Bitmap(tankImage);
		this.tankBody.regX = 0.5 * tankImage.width;
		this.tankBody.regY = 0.5 * tankImage.height;
		this.tankVelocity = 250;
		this.tankAnchorPoint = new tfn.Vector2D(0.5, 0.5);
		
		this.addChild(this.tankBody);
	}
	
	Tank.prototype.initializeTurret = function() {
		var turretImage = tfn.preloader.getResult("tank-turret-" + this.colorName);
		this.turret = new createjs.Bitmap(turretImage);
		this.turret.regX = 0.22 * turretImage.width;
		this.turret.regY = 0.5 * turretImage.height;
		
		this.addChild(this.turret);
	}
	
	Tank.prototype.moveForward = function() {
		this.move(this.tankVelocity);
	}
	
	Tank.prototype.moveBackward = function() {
		this.move(-this.tankVelocity);
	}

	Tank.prototype.resetVelocity = function() {
		this.currentVelocity = new tfn.Vector2D(0, 0);
	}
	
	Tank.prototype.move = function(velocity) {
		// Just apply a constant velocity relative to the timestep.
		var radians = this.tankBody.rotation * (Math.PI / 180);
		var timestep = tfn.lastTimestep;
	
		var velocityX = velocity * Math.cos(radians);
		var velocityY = velocity * Math.sin(radians);
		var x = this.currentPosition.x + velocityX * timestep
		var y = this.currentPosition.y + velocityY * timestep;
		
		this.currentVelocity = new tfn.Vector2D(velocityX, velocityY);
		
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
	
	// Sets the tank rotation without emitting an update.
	Tank.prototype.setTankRotation = function(rotation) {
		this.tankBody.rotation = rotation;
	}
	
	// Sets the turret rotation without emitting an update.
	Tank.prototype.setTurretRotation = function(rotation) {
		this.turret.rotation = rotation;
	}
	
	Tank.prototype.rotateChild = function(child, amount) {
		child.rotation = (child.rotation + amount) % 360;
		this.stateChangedHandler(this.tankBody.x, this.tankBody.y, this.tankBody.rotation, this.turret.rotation);
	}
	
	Tank.prototype.fire = function() {
		// Don't allow for fire spamming.
		if (Date.now() - this.lastPlayerShot < 500) {
			return;
		}
		
		var rotationRadians = this.turret.rotation * Math.PI / 180;
		var startingX = this.turret.x + this.turret.image.width * Math.cos(rotationRadians);
		var startingY = this.turret.y + this.turret.image.width * Math.sin(rotationRadians);
		
		this.lastPlayerShot = Date.now();
		this.shouldFireHandler(startingX, startingY, this.turret.rotation, this.playerNumber);
	}
	
	tfn.Tank = Tank;
})();
