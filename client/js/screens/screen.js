(function() {
	var Screen = function() {
		this.initialize();
	}
	var prototype = new createjs.Container();
	Screen.prototype = prototype;
	Screen.prototype.container_initialize = prototype.initialize;
	Screen.prototype.initialize = function() {
		this.container_initialize();
		Function.initMixins(this);
	}	
	
	tfn.Screen = Screen;
})();
