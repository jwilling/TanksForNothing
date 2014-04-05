(function() {
	var Screen = function() {
		this.initialize();
	}
	var prototype = new createjs.Container();
	Screen.prototype = prototype;
	Screen.prototype.container_initialize = prototype.initialize;
	
	// Set up a default destroy handler function which should be called
	// by the object that adds and remove this object on the screen.
	Screen.prototype.onDestroyHandler = function() {
		// Loop over all of the children and remove their listeners.
		for (var i = 0; i < this.getNumChildren(); i++) {
			this.getChildAt(i).removeAllEventListeners();
		}
		
		// By default we want to remove all of our children when we are
		// destroyed.
		this.removeAllChildren();
	}
	
	// Set up a default hander for when the screen has been added
	// to the stage. Must be called by the object that adds and removes
	// objects on the screen.
	Screen.prototype.onDisplayHandler = function() {
		// By default, redraw the stage.
		game.stage.update();
	}
	
	// A convenience function for setting up a static bitmap image.
	Screen.prototype.addImage = function(imageName, x, y) {
		var image = tfn.preloader.getResult(imageName);
		var bitmap = new createjs.Bitmap(image);
		bitmap.x = x;
		bitmap.y = y;
		
		this.addChild(bitmap);
		return bitmap;
	}
	
	// A convience function for setting up a button with a click handler.
	Screen.prototype.addButton = function(imageName, x, y, clickHandler) {
		this.addImage(imageName, x, y).on("click", clickHandler);
	}
	
	// Set up the prototype initialize function called whenever the
	// screen object is created.
	Screen.prototype.initialize = function() {
		this.container_initialize();
		
		// Initialize the mixins so subclasses can inherit from us.
		Function.initMixins(this);
	}
	
	tfn.Screen = Screen;
})();
