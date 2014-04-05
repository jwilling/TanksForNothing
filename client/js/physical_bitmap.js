(function() {
	// The initializer for a new physical bitmap, which has
	// the ability to run a simple simulation of a frictionless
	// single-body object using a second-order approximation.
	//
	//       imageName — the name of the (preloaded) bitmap image
	//               x — the x origin of the bitmap
	//               y - the y origin of the bitmap
	// maximumVelocity - the maximum speed the object can go
	var PhysicalBitmap = function(imageName, x, y, maximumVelocity) {
		this.initialize(imageName, x, y, maximumVelocity);
	}
	
	var prototype = new createjs.Bitmap();
	PhysicalBitmap.prototype = prototype;
	PhysicalBitmap.prototype.bitmap_initialize = prototype.initialize;	
	
	// An object that stores a 2D vector.
	function Vector2D(x, y) {
		this.x = x;
		this.y = y;
	}
	
	// Utility function to clamp a numerical value between
	// an upper and lower bounds.
	function clamp(value, lowerBound, upperBound) {
		return Math.min(Math.max(value, lowerBound), upperBound);
	}
	
	// Initializer.
	PhysicalBitmap.prototype.initialize = function(imageName, x, y, maximumVelocity) {
		this.bitmap_initialize();
		
		// Set up our initial values.
		this.lastTick = -Infinity;
		this.acceleration = new Vector2D(0, 0);
		this.currentVelocity = new Vector2D(0, 0);
		this.currentPosition = new Vector2D(0, 0);
		this.maximumVelocity = new Vector2D(maximumVelocity, maximumVelocity);
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
		// We first will calculate the current velocity.
		//     v = v + a * dt
		var oldVelocity = this.currentVelocity;
		this.currentVelocity.x = this.currentVelocity.x + this.acceleration.x * timestep;
		this.currentVelocity.y = this.currentVelocity.y + this.acceleration.y * timestep;
		
		// Clamp the velocity to the maximum velocity.
		this.currentVelocity.x = clamp(this.currentVelocity.x, -this.maximumVelocity.x, this.maximumVelocity.x);
		this.currentVelocity.y = clamp(this.currentVelocity.y, -this.maximumVelocity.y, this.maximumVelocity.y);
		
		// Calculate the position.
		//     x = x0 + (v0 + v) * 0.5 * dt
		var positionX = this.currentPosition.x + (oldVelocity.x + this.currentVelocity.x) * 0.5 * timestep;
		var positionY = this.currentPosition.y + (oldVelocity.y + this.currentVelocity.y) * 0.5 * timestep;
		
		// Update the position.
		this.setPosition(positionX, positionY);
	}
	
	// Sets the position of the bitmap.
	//
	// Requires an update of the stage to draw the changes.
	PhysicalBitmap.prototype.setPosition = function(x, y) {
		this.currentPosition = new Vector2D(x, y);
		this.x = x;
		this.y = y;
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
