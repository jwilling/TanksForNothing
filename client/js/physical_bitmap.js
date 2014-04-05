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
		
		// Set up the image.
		var image = tfn.preloader.getResult(imageName);
		this.image = image;
		
		Function.initMixins(this);
	}
	
	// Sets a new acceleration on the object.
	PhysicalBitmap.prototype.setAcceleration = function(accelerationX, accelerationY) {
		this.acceleration = new Vector2D(accelerationX, accelerationY);
	}
	
	PhysicalBitmap.prototype.tick = function(event) {
		if (this.lastTick < 0) {
			this.lastTick = createjs.Ticker.getTime();
		}
		
		var currentTime = createjs.Ticker.getTime();
		var timestep = (currentTime - this.lastTick) / 1000;
		this.lastTick = currentTime;

		// Run a Verlet second-order integration.
		
		var oldVelocity = this.currentVelocity;
		this.currentVelocity.x = this.currentVelocity.x + this.acceleration.x * timestep;
		this.currentVelocity.y = this.currentVelocity.y + this.acceleration.y * timestep;
		
		// Clamp the velocity to the maximum.
		this.currentVelocity.x = clamp(this.currentVelocity.x, -this.maximumVelocity.x, this.maximumVelocity.x);
		this.currentVelocity.y = clamp(this.currentVelocity.y, -this.maximumVelocity.y, this.maximumVelocity.y);
		
		var positionX = this.currentPosition.x + (oldVelocity.x + this.currentVelocity.x) * 0.5 * timestep;
		var positionY = this.currentPosition.y + (oldVelocity.y + this.currentVelocity.y) * 0.5 * timestep;
		
		this.currentPosition.x = positionX;
		this.currentPosition.y = positionY;
		this.x = positionX;
		this.y = positionY;
	}
	
	tfn.PhysicalBitmap = PhysicalBitmap;
})();
