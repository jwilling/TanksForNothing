tfn.Bullet = tfn.PhysicalBitmap.fastClass(function(base, baseConstructor) {
	this.constructor = function(x, y, angle) {
		var velocity = 200;
		var timeToLive = 2000; // ms
		
		baseConstructor.call(this, "tank-bullet-red", x, y, velocity);
		
		var radians = angle * (Math.PI / 180);
		var velocityX = velocity * Math.cos(radians);
		var velocityY = velocity * Math.sin(radians);

		this.currentVelocity = new tfn.Vector2D(velocityX, velocityY);
		this.setAnchorPoint(0.5, 0.5);
		
		setTimeout(this.kill.bind(this), timeToLive);
	}
	
	this.kill = function() {
		// Remove ourself from the parent as we're now dead!
		this.parent.removeChild(this);
	}
	
	this.tick = function() {
		base.tick.call(this);
		
		var collisionDetector = new tfn.CollisionDetector(this.getCollisionRect(), this.parent.mapBitmap, "map");
		this.setCollisions(collisionDetector.collisions);
	}
});
