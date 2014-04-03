(function() {
	var PreloadingScreen = tfn.Screen.inheritWith(function(base, baseConstructor) {
		return {
			constructor: function() {
				// Add a loading label.
				var loadingLabel = new createjs.Text("Loading", "26px Futura", "white");
				loadingLabel.x = (game.stage.canvas.width / 2) - (loadingLabel.getMeasuredWidth() / 2);
				loadingLabel.y = (game.stage.canvas.height / 2) - (loadingLabel.getMeasuredHeight() / 2)
				
				// Fill the background with black by adding a black graphics shape.
				var background = new createjs.Shape();
				background.graphics.beginFill("black").drawRect(0, 0, game.stage.canvas.width, game.stage.canvas.height);
				
				// Add the views.
				this.addChild(background);
				this.addChild(loadingLabel);
				
				// Create a preloading queue.
				var preloader = new createjs.LoadQueue(false);
				preloader.loadManifest(tfn.resources);
				
				// Move to the next screen when preloading is done.
				preloader.addEventListener("complete", function() {
					game.setScreenState(STATE_SPLASH);
				});
				
				// Start the preloader.
				preloader.load();
				
				tfn.preloader = preloader;
			},
			
			onDestroyHandler : function() {
				this.removeAllChildren();
			}
		}
	});
	
	tfn.PreloadingScreen = PreloadingScreen;
})();
