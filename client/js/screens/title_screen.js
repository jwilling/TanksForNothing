(function() {
	var TitleScreen = tfn.Screen.inheritWith(function(base, baseConstructor) {
		return {
			constructor: function() {
				// Add the background.
				var backgroundImage = tfn.preloader.getResult("title-background");
				var background = new createjs.Bitmap(backgroundImage);
				
				this.addChild(background);

				// Add an event listener for a click on the image.
				this.addEventListener("click", function(event) {
					alert("clicked");
				});
			}
		}
	});
	
	tfn.TitleScreen = TitleScreen;
})();
