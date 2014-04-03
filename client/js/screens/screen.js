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
		// By default we want to remove all of our children when we are
		// destroyed.
		this.removeAllChildren();
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
