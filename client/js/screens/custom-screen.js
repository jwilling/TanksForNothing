// A custom screen object that provides some sensible defaults.
//
// Note that the canvas will be blanked when drawing.
var CustomScreen = me.ScreenObject.extend({
	init : function() {
		// Call the parent initializer using the following parameters:
		//		addAsObject = true
		//		persist = false;
		this.parent(true, false);
		
		// Force our z-position to be at 0.
		this.z = 0;
	},
	
	// Override the canvas drawing.
	draw : function(context) {
		// Clear the canvas.
		me.video.clearSurface(context, "#000");
	},
});
