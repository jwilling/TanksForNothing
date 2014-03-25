game.TitleScreen = me.ScreenObject.extend({
	
	// redefine the constructor
	init : function() {
		this.parent(true);

		// title screen image
		this.title = null;
		
		//Any key press causes game to proceed to menu.
		window.addEventListener('keydown', function(e){
			window.removeEventListener('keydown', function(e){}, false);
			me.state.change(me.state.PLAY);
		}, false);
	},
	/**	
	 *  action to perform on state change
	 */
	onResetEvent : function() {
		if (this.title == null) {
			// init stuff if not yet done
			this.title = me.loader.getImage("Start_Menu");
			
			// add the object at pos (10,10), z index 4
			me.game.add((new myButton(10,10)),0);				
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
		context.drawImage(this.title, 0,0);
	},
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
	  me.input.unbindKey(me.input.KEY.LEFT);
	  
	}
});