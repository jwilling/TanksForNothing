(function() {
	// An object that stores a 2D vector.
	function Vector2D(x, y) {
		this.x = x;
		this.y = y;
	}
	
	// An object that stores values composed to make a rect.
	function Rect(x, y, width, height, rotation, anchorPoint) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.rotation = rotation || 0;
		this.anchorPoint = anchorPoint || new Vector2D(0, 0);
	}

	tfn.Vector2D = Vector2D;
	tfn.Rect = Rect;
})();
