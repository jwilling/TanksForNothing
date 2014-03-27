game.MainMenuScreen = me.ScreenObject.extend({
	init : function() {
		this.parent(true, false);
		this.z = 0;
	},
	
	onDestroyEvent : function() {

	},
	
	draw : function(context) {
		// Clear the canvas.
		me.video.clearSurface(context, "#000");
	},
});
