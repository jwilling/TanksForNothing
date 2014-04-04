tfn.GameScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function() {
		baseConstructor.call(this);
		
		// Add a blank background image.
		this.addImage("background-blank", 0, 0);
		
		// TODO: load map.
		
	}
});
