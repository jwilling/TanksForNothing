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
	
	// An object that stores a point.
	function Point(x, y) {
		this.x = x;
		this.y = y;
	}
	
	Point.prototype.clone = function() {
		return new Point(this.x, this.y);
	}
	
	// Returhs whether or not the point specified by the
	// x and y values are within the rect.
	Rect.prototype.containsPoint = function(point) {
		// We need to translate the rect back to its original 
		// position before applying the anchor point.
		var rx = this.x - this.anchorPoint.x * this.width;
		var ry = this.y - this.anchorPoint.y * this.height;
		
		// Ideally we should get this point to be on the same
		// plane as the rect (in terms of rotation) but this
		// somewhat works for now.
		var p = point;
		
		return (rx <= p.x && p.x <= rx + this.width && ry <= p.y && p.y <= ry + this.height);
	}

	tfn.Vector2D = Vector2D;
	tfn.Rect = Rect;
	tfn.Point = Point;
})();
