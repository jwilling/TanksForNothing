(function() {
	// The initializer for a new physical bitmap, which has
	// the ability to run a simple simulation of a frictionless
	// single-body object using a second-order approximation.
	//
	//       imageName — the name of the (preloaded) bitmap image
	//               x — the x origin of the bitmap
	//               y - the y origin of the bitmap
	// maximumVelocity - the maximum speed the object can go
	//        friction - the friction applied to the object (0 - 1)
	//   a...Magnitude - the maximum acceleration applied to the object
	var PhysicalBitmap = function(imageName, x, y, maximumVelocity, friction, accelerationMagnitude) {
		this.initialize(imageName, x, y);
		
		this.friction = friction || 0;
		this.maximumVelocity = new Vector2D(maximumVelocity, maximumVelocity);
		this.accelerationMagnitude = accelerationMagnitude;
	}
	
	var prototype = new createjs.Bitmap();
	PhysicalBitmap.prototype = prototype;
	PhysicalBitmap.prototype.bitmap_initialize = prototype.initialize;	
	
	// An object that stores a 2D vector.
	function Vector2D(x, y) {
		this.x = x;
		this.y = y;
	}
	
	// An object that stores values composed to make a rect.
	function Rect(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	// Utility function to clamp a numerical value between
	// an upper and lower bounds.
	function clamp(value, lowerBound, upperBound) {
		return Math.min(Math.max(value, lowerBound), upperBound);
	}
	
	// Initializer.
	PhysicalBitmap.prototype.initialize = function(imageName, x, y) {
		this.bitmap_initialize();
		
		// Set up our initial (internal) values.
		this.lastTick = -Infinity;
		this.acceleration = new Vector2D(0, 0);
		this.currentVelocity = new Vector2D(0, 0);
		this.currentPosition = new Vector2D(x, y);
		this.lastAppliedAcceleration = new Vector2D(0, 0);
		this.anchorPoint = new Vector2D(0, 0);
		
		// Set up the image.
		var image = tfn.preloader.getResult(imageName);
		this.image = image;
		
		Function.initMixins(this);
	}
	
	// Sets a new acceleration on the object.
	PhysicalBitmap.prototype.setAcceleration = function(accelerationX, accelerationY) {
		this.acceleration = new Vector2D(accelerationX, accelerationY);
	}
	
	// The function that simulates movement on the physical object.
	//
	// Should be called by the parent every game tick.
	PhysicalBitmap.prototype.tick = function(event) {

		// Make sure we have a valid initial tick time.
		if (this.lastTick < 0) {
			this.lastTick = createjs.Ticker.getTime();
		}
		
		// Calculate the delta since the last tick.
		var currentTime = createjs.Ticker.getTime();
		var timestep = (currentTime - this.lastTick) / 1000;
		this.lastTick = currentTime;

		// Run a Verlet second-order integration. This is better
		// than the simpler Euler integration, assuming a constant
		// acceleration, because it allows for a perfectly accurate
		// integration of the velocity, meaning over time it will
		// not drift from the correct values, regardless of the timestep.
		//
		// First we calculate the acceleration. This will have a frictional
		// force applied to it.
		var acceleration = new Vector2D(this.acceleration.x, this.acceleration.y);
		
		// var radians = this.rotation * (Math.PI / 180);
		// var accelerationModifierX = (this.currentVelocity.x >= 0 ? 1 : -1);
		// var accelerationModifierY = (this.currentVelocity.y >= 0 ? 1 : -1);
		// var frictionalMagnitudeX = this.accelerationMagnitude * Math.cos(radians);
		// var frictionalMagnitudeY = this.accelerationMagnitude * Math.sin(radians);
		// var frictionalAccelerationX = (this.acceleration.x != 0 ? this.acceleration.x : frictionalMagnitudeX);
		// var frictionalAccelerationY = (this.acceleration.y != 0 ? this.acceleration.y : frictionalMagnitudeY);
		// acceleration.x = acceleration.x - frictionalAccelerationX * this.friction;
		// acceleration.y = acceleration.y - frictionalAccelerationY * this.friction;
		
		// Clamp the acceleration.
		//acceleration.x = clamp(acceleration.x, -this.accelerationMagnitude, this.accelerationMagnitude);
		//acceleration.y = clamp(acceleration.y, -this.accelerationMagnitude, this.accelerationMagnitude);
							
		// Next we calculate the velocity.
		//     v = v + a * dt
		var oldVelocity = this.currentVelocity;
		var velocityX = this.currentVelocity.x + acceleration.x * timestep;
		var velocityY = this.currentVelocity.y + acceleration.y * timestep;
				
		// Clamp the velocity to the maximum velocity.
		velocityX = clamp(velocityX, -this.maximumVelocity.x, this.maximumVelocity.x);
		velocityY = clamp(velocityY, -this.maximumVelocity.y, this.maximumVelocity.y);
		
		// If we're not actively applying an acceleration in a 
		// specific direction, we shouldn't let the frictional
		// acceleration cause the body to drift in the opposite
		// direction.
		// if (this.shouldZeroVelocity(this.acceleration.x, this.lastAppliedAcceleration.x, velocityX, this.currentVelocity.x)) {
		// 	velocityX = 0;	
		// }
		// if (this.shouldZeroVelocity(this.acceleration.y, this.lastAppliedAcceleration.y, velocityY, this.currentVelocity.y)) {
		// 	velocityY = 0;	
		// }
		
		// Calculate the position.
		//     x = x0 + (v0 + v) * 0.5 * dt
		var positionX = this.currentPosition.x + (oldVelocity.x + velocityX) * 0.5 * timestep;
		var positionY = this.currentPosition.y + (oldVelocity.y + velocityY) * 0.5 * timestep;
		
		// Update the stored velocity.
		this.currentVelocity = new Vector2D(velocityX, velocityY);
		
		// Update the position.
		this.setPosition(positionX, positionY);
		
		// Update the last-applied acceleration.
		if (this.acceleration.x != 0) this.lastAppliedAcceleration.x = this.acceleration.x;
		if (this.acceleration.y != 0) this.lastAppliedAcceleration.y = this.acceleration.y;
	}
	
	// PhysicalBitmap.prototype.shouldZeroVelocity = function(acceleration, lastAppliedAcceleration, proposedVelocity, currentVelocity) {
	// 	if (acceleration != 0) {
	// 		return false;
	// 	}
	// 	
	// 	return (currentVelocity == 0
	// 		|| lastAppliedAcceleration < 0 && proposedVelocity >= currentVelocity && proposedVelocity > 0
	// 		|| lastAppliedAcceleration > 0 && proposedVelocity <= currentVelocity && proposedVelocity < 0);
	// }
	
	// Sets the position of the bitmap.
	//
	// Requires an update of the stage to draw the changes.
	PhysicalBitmap.prototype.setPosition = function(x, y) {
		this.currentPosition = new Vector2D(x, y);
		this.x = x;
		this.y = y;
	}
	
	PhysicalBitmap.prototype.setCollisionRect = function(x, y, width, height) {
		this.collisionRect = new Rect(x, y, width, height);
	}
	
	PhysicalBitmap.prototype.getCollisionRect = function() {
		return this.collisionRect || new Rect(0, 0, this.image.width, this.image.height);
	}
	
	// Sets the anchor point of the object. This determines
	// both the point where the object will rotate around, as
	// well as the point at which setting the position will
	// place the object.
	//
	// Both x and y should be in a range from 0 - 1.
	//
	// The default anchor point is 0, 0.
	PhysicalBitmap.prototype.setAnchorPoint = function(x, y) {
		this.anchorPoint = new Vector2D(x, y);
		this.regX = x * this.image.width;
		this.regY = y * this.image.height;
	}
	
	tfn.PhysicalBitmap = PhysicalBitmap;
})();
