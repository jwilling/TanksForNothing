(function() {
	var Screen = function() {
		this.initialize();
	}
	var prototype = new createjs.Container();
	Screen.prototype = prototype;
	Screen.prototype.container_initialize = prototype.initialize;
	Screen.prototype.initialize = function() {
		this.container_initialize();
		
		// Set up an empty handler that the game will call when it transitions
		// away from the current screen. 
		this.onDestroyHandler = function() {
			
		}
		
		Function.initMixins(this);
	}
	
	tfn.Screen = Screen;
})();
