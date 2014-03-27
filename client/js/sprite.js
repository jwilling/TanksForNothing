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
		// Call the parent constructor with the correct sizes.
		if (width != null && height != null) {
			this.parent(x, y, width, height);
		} else {
			var image = me.loader.getImage(imageName);
			this.parent(x, y, image.width, image.height);
		}

		// Make sure the object doesn't depend on the screen.
		this.isPersistent = true;
		
		// By default it shouldn't be collidable.
		this.collidable = false;
		
		// If the z-index wasn't provided, make sure we're 
		// on top of the world.
		this.z = zIndex || Infinity;
		
		// Add the actual renderer as a child inside this container.
		var renderer = new ImageRenderable(imageName, x, y, width, height, zIndex);
		this.addChild(renderer);
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
		
		me.input.registerPointerEvent('mousedown', this, this.clicked.bind(this));
	}, 
	
	clicked : function(event) {
		this.clickHandler();
	}
});

// An internal renderable object that manipulates the canvas.
//
// Should not be used directly. Use ImageSprite or ImageButton instead.
var ImageRenderable = me.Renderable.extend({
	init : function(imageName, x, y, width, height) {		
		// Initialize our position to be nothing, really.
		//
		// Since the drawing will be done through the canvas
		// the size and position doesn't even matter.
		this.parent(new me.Vector2d(0, 0), 0, 0);
				
		// Turn on floating, which means we will use canvas coordinates.
		//
		// Without this, we won't get rendered because lolmelon.
		this.floating = true;
		
		// Flag ourself as "dirty" so that we'll get a screen update.
		this.needsUpdate = true;
		
		// Save the coordinates for later.
		this.x = x || 0;
		this.y = y || 0;
		
		// Save the width and the height, which might or might not be
		// supplied. If they are given, we use them, otherwise we
		// let the canvas decide how big the image is.
		this.width = width;
		this.height = height;
		
		// Load the image for later drawing.
		this.image = me.loader.getImage(imageName);
	},
	
	update : function() {
		if (this.needsUpdate) {
			this.needsUpdate = false;
			return true;
		}
		
		return false;
	},
	
	draw : function(context) {		
		// If we have the width and the height, use them, otherwise
		// allow the canvas to infer those values.
		if (this.height != null && this.width != null) {
			context.drawImage(this.image, this.x, this.y, width, height);
		} else {
			context.drawImage(this.image, this.x, this.y);
		}
	}
});
