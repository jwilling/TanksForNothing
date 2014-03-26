
/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		// score
		score : 0
	},
	
	
	// Run on page load.
	"onload" : function () {
	// Initialize the video.
	if (!me.video.init("screen", 640, 480, true, 'auto')) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "#debug" to the URL to enable the debug Panel
	if (document.location.hash === "#debug") {
		window.onReady(function () {
			me.plugin.register.defer(debugPanel, "debug");
		});
	}

	// Initialize the audio.
	me.audio.init("mp3,ogg");

	// Set a callback to run when loading is complete.
	me.loader.onload = this.loaded.bind(this);

	// Load the resources.
	me.loader.preload(game.resources);

	// Initialize melonJS and display a loading screen.
	me.state.change(me.state.LOADING);
},

	// Run on game resources loaded.
	"loaded" : function () {
		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());
		
		// add our player entity in the entity pool
  		 me.entityPool.add("mainPlayer", game.PlayerEntity);
  		 me.entityPool.add("mainPlayerTurret", game.TurretEntity);
  		 me.entityPool.add("bullet", game.BulletEntity, true);

  		           
  		 // enable the keyboard
 		  me.input.bindKey(me.input.KEY.A,  "left");
 		  me.input.bindKey(me.input.KEY.D, "right");
  		  me.input.bindKey(me.input.KEY.W, "up");
  		  me.input.bindKey(me.input.KEY.S, "down");
  		  me.input.bindKey(me.input.KEY.SPACE, "space");
  		  me.input.bindKey(me.input.KEY.LEFT, "rotateCountClock");
  		  me.input.bindKey(me.input.KEY.RIGHT, "rotateClock");
  		  


		// Start the game.
		me.state.change(me.state.PLAY);
	}
};
