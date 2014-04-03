(function() {
	var TitleScreen = tfn.Screen.inheritWith(function(base, baseConstructor) {
		return {
			constructor: function() {
				var circle = new createjs.Shape();
				circle.graphics.beginFill("red").drawCircle(0, 0, 40);
				
				this.addChild(circle);
			}
		}
	});
	
	tfn.TitleScreen = TitleScreen;
})();
