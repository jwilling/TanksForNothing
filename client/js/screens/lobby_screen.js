tfn.LobbyScreen = tfn.Screen.fastClass(function(base, baseConstructor) {
	this.constructor = function(isHost) {
		baseConstructor.call(this);
				
		// Add the background.
		this.addImage("background", 0, 0);
		
		// Set up the exit lobby button.
		this.addButton("menu-button-exit-lobby", 0, 0, function() {
			console.log("hey!");
		});
		
		console.log("Are we host? " + isHost);
	}
});
