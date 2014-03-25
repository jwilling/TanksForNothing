game.TitleScreen = me.ScreenObject.extend({
	
	// redefine the constructor
	init : function() {
		this.parent(true);

		// title screen image
		this.title = null;
	},
	/**	
	 *  action to perform on state change
	 */
	onResetEvent : function() {
		if (this.title == null) {
			// init stuff if not yet done
			this.title = me.loader.getImage("openTestScreen");				
		}
		
		me.input.bindKey(me.input.KEY.LEFT, "left");
	},
	
	update : function() {
		if (me.input.isKeyPressed('left')) {
			me.state.change(me.state.PLAY);
		}
		return true;
	},
	
	// the main drawing function
	draw : function(context) {
		context.drawImage(this.title, 10,10);
	},
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
	  me.input.unbindKey(me.input.KEY.LEFT);
	}
});