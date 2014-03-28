// An object that draws the image to the screen, acting like a sprite.
//
// Sample usage:
//		var sprite = new ImageSprite("image", 10, 10);
//		me.game.world.addChild(sprite);
//
// Be sure to remove the sprite when the screen is destroyed.
var ImageSprite = me.ObjectContainer.extend({
	// The initializer.
	//
	// Note that the width, height, and zIndex are optional.
	init : function(imageName, x, y, width, height, zIndex) {
		// Load and store the image.
		this.image = me.loader.getImage(imageName);
		
		// Store the width and the height.
		width = width || this.image.width;
		height = height || this.image.height;
		
		// Store our x and y coordinates.
		this.x = x || 0;
		this.y = y || 0;
		
		// Call the parent constructor with the correct sizes.
		this.parent(x, y, width, height);

		// Make sure the object doesn't depend on the screen.
		this.isPersistent = true;
				
		// By default it shouldn't be collidable.
		this.collidable = false;
		
		// If the z-index wasn't provided, make sure we're 
		// on top of the world.
		this.z = zIndex || Infinity;

		// Make an empty callback for when we change position.
		this.positionChangedHandler = function(x, y) {};
		
		// Perform an initial draw.
		this.dirty = true;
	},
	
	update : function() {
		// Only draw an update to the screen if our internal state
		// has changed.
		if (this.dirty) {
			this.dirty = false;
			return true;
		}
		
		return false;
	},
	
	moveToPoint : function(x, y) {
		var positionChanged = (this.x != x || this.y != y);
		this.x = x;
		this.y = y;

		// Only trigger a drawing update if the position has actually
		// changed since the last redraw for performance reasons.
		if (positionChanged) {
			this.dirty = true;
			this.positionChangedHandler(x, y);
		}
	},
	
	draw : function(context) {
		if (this.height != null && this.width != null) {
			context.drawImage(this.image, this.x, this.y, this.width, this.height);
		} else {
			context.drawImage(this.image, this.x, this.y);
		}
	}
});

// An object that extends the sprite and has clickable capabilities.
//
// Behaves like the regular image sprite in all aspects, except it
// allows for mouse events.
//
// Sample usage:
//		var button = new ImageButton("image", 10, 10);
//		button.clickHandler = function() { console.log("hi!") };
//		me.game.world.addChild(button);
//		
// Be sure to remove the sprite when the screen is destroyed.
var ImageButton = ImageSprite.extend({
	init : function(imageName, x, y, width, height, zIndex) {
		this.parent(imageName, x, y, width, height, zIndex)

		// Create an empty handler for the click event. This should
		// be set later by the user.
		this.clickHandler = function() {};
		
		// Register for receiving pointer events.
		me.input.registerPointerEvent('mousedown', this, this.clicked.bind(this));
	},
	
	destroy : function() {
		this.parent();
		
		// Remove the handler for the rect.
		me.input.releasePointerEvent('mousedown', this);
	},
	
	clicked : function(event) {
		// Forward the click onto the user-set handler.
		this.clickHandler();
	}
});
