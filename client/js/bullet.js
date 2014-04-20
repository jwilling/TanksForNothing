tfn.Bullet = tfn.PhysicalBitmap.fastClass(function(base, baseConstructor) {
	this.constructor = function(x, y, angle, colorName, playerID) {
		var velocity = 200;
		var timeToLive = 2000; // ms

		baseConstructor.call(this, "tank-bullet-" + colorName, x, y, velocity);
		
		var radians = angle * (Math.PI / 180);
		var velocityX = velocity * Math.cos(radians);
		var velocityY = velocity * Math.sin(radians);

		this.currentVelocity = new tfn.Vector2D(velocityX, velocityY);
		this.setAnchorPoint(0.5, 0.5);
		this.ownerPlayerID = playerID;
		
		// Rotate the bullet for easier collision detection.
		this.rotation = 45;
		
		this.timer = setTimeout(this.kill.bind(this), timeToLive);
	}
	
	this.kill = function() {
		// Just in case we were killed by something else, remove
		// the timeout so we don't try to remove a null object.
		clearTimeout(this.timer);
		
		// Remove ourself from the parent as we're now dead!
		this.parent.removeChild(this);
	}
	
	this.tick = function() {
		base.tick.call(this);
				
		var collisionDetector = new tfn.CollisionDetector(this.mapBitmap, "map");
		var collisionEdge = collisionDetector.determineCollisionEdge(this.getCollisionRect());
		
		this.handlePossibleCollision(collisionDetector, collisionEdge);
	}
	
	this.handlePossibleCollision = function(collisionDetector, collisionEdge) {
		if (collisionEdge == collisionDetector.collisionEdge.RIGHT ||
			collisionEdge == collisionDetector.collisionEdge.LEFT) {
			this.currentVelocity.x *= -1;
		}
		if (collisionEdge == collisionDetector.collisionEdge.TOP ||
			collisionEdge == collisionDetector.collisionEdge.BOTTOM) {
			this.currentVelocity.y *= -1;
		}
	}
});
