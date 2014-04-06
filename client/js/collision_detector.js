(function() {
	// Creates a new point object.
	function Point(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}
	
	var CollisionDetector = function(physicalSprite, boundingMap) {
		// FIND 4 POINTS
		// CHECK those points on pixels of bounding map
		// IF any of those intersect, we have a collision
		

		// Get the collision rect from the object.
		var rect = this.getCollisionRect(physicalSprite);

		// Get the relative anchor point from the object.
		//
		// This will be transposted into a global point later. 
		var relativeAnchorPoint = new Point(physicalSprite.regX, physicalSprite.regY);
		
		// Calculate the rotated rect derived from individual rotation
		// of the four points.
		var rotatedRect = this.createRotatedRect(rect, relativeAnchorPoint, physicalSprite.rotation);

		// Now we draw the bounding map into our sampling canvas.
		this.drawBitmapIntoCanvas(boundingMap);
		
		// Finally actually check for collisions.
		this.calculateCollisions(rotatedRect);
	}

	CollisionDetector.prototype.collisions = {
		LEFT : false,
		RIGHT : false,
		TOP : false,
		BOTTOM : false
	}
	
	// Convenience function to clone a point.
	//
	// Because JavaScript.
	Point.prototype.clone = function() {
		return new Point(this.x, this.y);
	}
	
	// Creates a new rectangle object from point objects.
	//
	//    p1 --------- p2
	//    |            |
	//    |            |
	//    p4 --------- p3
	//
	function Rectangle(p1, p2, p3, p4) {
		this.p1 = p1 || new Point();
		this.p2 = p2 || new Point();
		this.p3 = p3 || new Point();
		this.p4 = p4 || new Point();
	}
	
	CollisionDetector.prototype.getCollisionRect = function(physicalSprite) {
		var rect = new Rectangle();
				
		// We have to get the four exact corners of the object.		
		rect.p1 = new Point(physicalSprite.x, physicalSprite.y);
		
		// This means that for objects that have an anchor point
		// which isn't (0, 0) we need to transpose it back to the 
		// on-screen position.
		rect.p1.x -= physicalSprite.regX;
		rect.p1.y -= physicalSprite.regY;
		
		rect.p2 = rect.p1.clone();
		rect.p3 = rect.p1.clone();
		rect.p4 = rect.p1.clone();
		
		rect.p2.x += physicalSprite.getCollisionRect().width;
		rect.p3.x = rect.p2.x;
		rect.p3.y += physicalSprite.getCollisionRect().height;
		rect.p4.y = rect.p3.y;
		
		return rect;
	}
	
	CollisionDetector.prototype.createRotatedPoint = function(point, globalAnchorPoint, rotation) {
		var sin = Math.sin(rotation);
		var cos = Math.cos(rotation);
		
		var rotatedPoint = point.clone();
		
		// Translate to make the global anchor point the origin.	
		rotatedPoint.x -= globalAnchorPoint.x;
		rotatedPoint.y -= globalAnchorPoint.y;
		
		// Apply the rotation matrix.
		//    | cos0 -sin0 |
		//    | sin0  cos0 |
		rotatedPoint.x = rotatedPoint.x * cos - rotatedPoint.y * sin;
		rotatedPoint.y = rotatedPoint.x * sin + rotatedPoint.y * cos;
		
		// Translate back.
		rotatedPoint.x += globalAnchorPoint.x;
		rotatedPoint.y += globalAnchorPoint.y;
		
		return rotatedPoint;
	}
	
	CollisionDetector.prototype.createRotatedRect = function(rect, relativeAnchorPoint, rotationDegrees) {
		// Convert the rotation in degrees to radians.
		var rotationRadians = rotationDegrees * (Math.PI / 180);
		
		// The anchor point is currently relative to the object.
		//
		// So we need to translate it into coordinates relative to
		// the parent of the object associated with the rect.
		var globalAnchorPoint = relativeAnchorPoint.clone();
		globalAnchorPoint.x += rect.p1.x;
		globalAnchorPoint.y += rect.p1.y;
		
		var p1 = this.createRotatedPoint(rect.p1, globalAnchorPoint, rotationRadians);
		var p2 = this.createRotatedPoint(rect.p2, globalAnchorPoint, rotationRadians);
		var p3 = this.createRotatedPoint(rect.p3, globalAnchorPoint, rotationRadians);
		var p4 = this.createRotatedPoint(rect.p4, globalAnchorPoint, rotationRadians);
		
		return new Rectangle(p1, p2, p3, p4);
	}
	
	// The canvas that is used for sampling the bounding map.
	//
	// Never displayed.
	CollisionDetector.prototype.drawingCanvas =  document.createElement('canvas');
	
	CollisionDetector.prototype.drawBitmapIntoCanvas = function(bitmap) {
		// Set the correct width and height on the canvas.
		this.drawingCanvas.width = bitmap.image.width;
		this.drawingCanvas.height = bitmap.image.height;
		
		// Get and clear the drawing context.
		var ctx = this.drawingCanvas.getContext('2d');
		ctx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
		
		// Save the context.
		ctx.save();
		
		// Draw the bitmap into the context.
		//
		// Rotate the context.
		var rotation = (bitmap.rotation * Math.IP) / 180;
		
		// Translate relative to the anchor point.
		ctx.translate(bitmap.x + bitmap.regX, bitmap.y + bitmap.regY);
		
		// Rotate around the anchor point.
		ctx.rotate(rotation);
		
		// Translate back.
		ctx.translate(-(bitmap.x + bitmap.regX), -(bitmap.y + bitmap.regY));
		
		// Draw into our drawing context.
		ctx.drawImage(bitmap.image, bitmap.x, bitmap.y, bitmap.image.width, bitmap.image.height);
		
		// Restore the settings.
		ctx.restore();
	}
	
	CollisionDetector.prototype.calculateCollisions = function(rotatedRect) {
		// We need a way to figure out the points that are closest
		// to each edge, whether it be top, bottom, left, or right.
		//
		// So we create sorting functions that can sort our points
		// from least to greatest.
		//
		// First up is a way to sort by the X values.
		function sortByX(p1, p2) {
			if (p1.x < p2.x) return -1;
			if (p1.x > p2.x) return 1;
			return 0;
		}
		
		// Then a sorter for Y values.
		function sortByY(p1, p2) {
			if (p1.y < p2.y) return -1;
			if (p1.y > p2.y) return 1;
			return 0;
		}
		
		// Create the arrays of points.
		var sortedByX = [rotatedRect.p1, rotatedRect.p2, rotatedRect.p3, rotatedRect.p4];
		var sortedByY = [rotatedRect.p1, rotatedRect.p2, rotatedRect.p3, rotatedRect.p4];
		
		// Perform the sorting.
		sortedByX.sort(sortByX);
		sortedByY.sort(sortByY);
		
		// Now we have to go through all four edges of the points
		// and see if we have a collision.
		//
		// To do this, we'll sample the bitmap that we've drawn
		// into the temporary canvas we created before using a
		// specific level of sampling granularity (resolution).
		//
		// First construct the sampling points.
		//     [top, bottom, left, right]
		var samplingPoints = [sortedByY[0], sortedByY[2], sortedByX[0], sortedByX[2]];
		var resolution = 1;
		
		// Grab the canvas drawing context.
		var ctx = this.drawingCanvas.getContext('2d');
		
		// Loop over the sample points and get the pixel data from
		// the canvas.
		var samplesPixelData = [];
		for (var i = 0; i < samplingPoints.length; i++) {
			var point = samplingPoints[i];
			var pixel = ctx.getImageData(point.x, point.y, resolution, resolution);
			
			samplesPixelData.push(pixel.data);
		}
		
		// Check each location for a collision.
		this.collisions.TOP = (samplesPixelData[0][3] > 0);
		this.collisions.BOTTOM = (samplesPixelData[1][3] > 0);
		this.collisions.LEFT = (samplesPixelData[2][3] > 0);
		this.collisions.RIGHT = (samplesPixelData[3][3] > 0);
	}
	
	tfn.CollisionDetector = CollisionDetector;
})();
