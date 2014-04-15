(function() {
	// Creates a new point object.
	function Point(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}
	
	// Perform a collision test with the specified Rect, bounding map,
	// and identifier. The identifier should be unique between bounding maps, as
	// the map itself is cached internally.
	var CollisionDetector = function(rect, boundingMap, identifier, velocity) {
		// Store the identifier and bitmap.
		this.identifier = identifier;
		this.bitmap = boundingMap;
		
		this.collisions = {
			LEFT : false,
			RIGHT : false,
			TOP : false,
			BOTTOM : false,
			COLLISION : false // whether any collisions occurred
		}
		
		// Get the relative anchor point from the object.
		//
		// This will be transposted into a global point later. 
		var relativeAnchorPoint = new Point(rect.anchorPoint.x * rect.width, rect.anchorPoint.y * rect.height);
		
		// Get the collision rect from the object.
		var collisionRect = this.getCollisionRect(rect, relativeAnchorPoint);
		
		// Calculate the rotated rect derived from individual rotation
		// of the four points.
		var rotatedRect = this.createRotatedRect(collisionRect, relativeAnchorPoint, rect.rotation);

		// Finally actually check for collisions.
		this.calculateCollisions(rotatedRect, velocity);
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
	
	CollisionDetector.prototype.getCollisionRect = function(collisionRect, relativeAnchorPoint) {
		var rect = new Rectangle();
						
		// We have to get the four exact corners of the object.		
		rect.p1 = new Point(collisionRect.x, collisionRect.y);
			
		// This means that for objects that have an anchor point
		// which isn't (0, 0) we need to transpose it back to the 
		// on-screen position.
		rect.p1.x -= relativeAnchorPoint.x;
		rect.p1.y -= relativeAnchorPoint.y;
		
		rect.p2 = rect.p1.clone();
		rect.p3 = rect.p1.clone();
		rect.p4 = rect.p1.clone();
		
		rect.p2.x += collisionRect.width;
		rect.p3.x = rect.p2.x;
		rect.p3.y += collisionRect.height;
		rect.p4.y = rect.p3.y;
				
		return rect;
	}
	
	CollisionDetector.prototype.createRotatedPoint = function(point, globalAnchorPoint, rotation) {
		var sin = Math.sin(rotation);
		var cos = Math.cos(rotation);
		
		var rotatedPoint = point.clone();

		// Translate to make the global anchor point the origin.
		var translatedPoint = point.clone();
		translatedPoint.x -= globalAnchorPoint.x;
		translatedPoint.y -= globalAnchorPoint.y;

		// Apply the rotation matrix.
		//    | cos0 -sin0 |
		//    | sin0  cos0 |
		rotatedPoint.x = cos * translatedPoint.x - sin * translatedPoint.y;
		rotatedPoint.y = sin * translatedPoint.x + cos * translatedPoint.y;
		
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
		
		return new Rectangle(p1, p2, p3, p4, rect.rotation);
	}
	
	// A cache for canvas elements used for sampling pixel data.
	var canvasCache = { };
	
	// A cache for bitmap pixel data.
	var pixelDataCache = { };
	
	// Returns the canvas for the specified identifier with
	// the bitmap already drawn into it.
	//
	// If it doesn't already exist, it will be created, and
	// the bitmap will be drawn into it.
	CollisionDetector.prototype.cachedSamplingCanvas = function() {
		var canvas = canvasCache[this.identifier];
		
		if (!canvas) {
			// Create the canvas.
			canvas = document.createElement('canvas');
			canvasCache[this.identifier] = canvas;
			
			// Draw the bitmap into it. This only should be done once
			// for performance reasons.
			this.drawBitmapIntoCanvas(canvas);
			
			var ctx = canvas.getContext('2d');
			pixelDataCache[this.identifier] = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
		}
		
		return canvas;
	}
		
	CollisionDetector.prototype.drawBitmapIntoCanvas = function(canvas) {
		// Set the correct width and height on the canvas.
		var bitmap = this.bitmap;
		canvas.width = bitmap.image.width;
		canvas.height = bitmap.image.height;
		
		// Get and clear the drawing context.
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

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
	}
	
	// Utilize Bresenham's Line Algorithm to interpolate between
	// the edge points.
	//
	// Implementation taken from http://rosettacode.org/wiki/Bitmap/Bresenham's_line_algorithm
	CollisionDetector.prototype.bline = function(x0, y0, x1, y1) {
		var p = [];
		
		x0 = Math.round(x0);
		y0 = Math.round(y0);
		x1 = Math.round(x1);
		y1 = Math.round(y1);
		
		var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
		var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1; 
		var err = (dx > dy ? dx : -dy) / 2;
					
		while (true) {
			p.push(new Point(x0, y0));
			
			if (x0 === x1 && y0 === y1) break;
			var e2 = err;
			
			if (e2 > -dx) { err -= dy; x0 += sx; }
			if (e2 < dy) { err += dx; y0 += sy; }
		}
		
		return p;
	}
	
	// Returns an array of points, sorted in no particular order.
	//
	// The array contains not only the four corner points, but
	// additional points that are interpolated.
	CollisionDetector.prototype.createIntermediatePoints = function(rotatedRect) {	
		var p12Interpolations = this.bline(rotatedRect.p1.x, rotatedRect.p1.y, rotatedRect.p2.x, rotatedRect.p2.y);
		var p23Interpolations = this.bline(rotatedRect.p2.x, rotatedRect.p2.y, rotatedRect.p3.x, rotatedRect.p3.y);
		var p34Interpolations = this.bline(rotatedRect.p3.x, rotatedRect.p3.y, rotatedRect.p4.x, rotatedRect.p4.y);
		var p41Interpolations = this.bline(rotatedRect.p4.x, rotatedRect.p4.y, rotatedRect.p1.x, rotatedRect.p1.y);
		
		return p12Interpolations.concat(p23Interpolations).concat(p34Interpolations).concat(p41Interpolations);
	}
	
	// Returns the center point from the rotated rect.
	CollisionDetector.prototype.calculateCenterPoint = function(minX, minY, maxX, maxY) {
		var point = new Point();
		point.x = (minX + maxX) / 2;
		point.y = (minY + maxY) / 2;
		return point;
	}
	
	
	CollisionDetector.prototype.calculateCollisions = function(rotatedRect, velocity) {		
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
		
		// Create a list of points that are created via interpolation
		// between the points on the rotated rect.
		var edgePoints = this.createIntermediatePoints(rotatedRect);
		
		// The point at which there is a collision, if any.
		var collisionPoint = null;
		
		// The center point of the rotated rect.
		var centerPoint = this.calculateCenterPoint(sortedByX[0].x, sortedByY[0].y, sortedByX[3].x, sortedByY[3].y);
		
		// Iterate over all of the points and check the pixel
		// data at that point to see if we have a collision.
		var canvasWidth = this.cachedSamplingCanvas().width;
		for (var i = 0; i < edgePoints.length; i++) {
			var point = edgePoints[i];
			var imageDataIndex = (point.y * canvasWidth + point.x) * 4;
			
			// Check the alpha channel. If it is not 0% opaque,
			// we have a hit.
			//
			// Remember that the first three channels are RGB, 
			// and the 4th is alpha. This means index + 2 is
			// the alpha channel.
			if (pixelDataCache[this.identifier][imageDataIndex + 2]) {
				collisionPoint = point;
				break;
			}
		}
				
		// No collisions!
		if (!collisionPoint) {
			return;
		}

		var movingUp = (velocity.y > 0);
		var movingDown = (velocity.y < 0);
		var movingRight = (velocity.x > 0);
		var movingLeft = (velocity.x < 0);
		
		//console.log("right: " + movingRight + " left: " + movingLeft + " up: " + movingUp + " down: " + movingDown);
		
		if (point.y <= centerPoint.y + (centerPoint.y - sortedByY[0].y) / 2 && movingUp) {
			this.collisions.TOP = true;			
		} else if (point.y >= centerPoint.y + (sortedByY[3].y - centerPoint.y && movingDown) / 2) {
			this.collisions.BOTTOM = true;
		}
		
		if (point.x <= centerPoint.x + (centerPoint.x - sortedByX[0].x) / 2 && movingLeft) {
			this.collisions.LEFT = true;
		} else if (point.x >= centerPoint.x + (sortedByX[3].x - centerPoint.x) / 2 && movingRight) {
			this.collisions.RIGHT = true;
		}

				
		this.collisions.COLLISION = true;
	}
	
	tfn.CollisionDetector = CollisionDetector;
})();
