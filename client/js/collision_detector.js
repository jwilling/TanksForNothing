(function() {
	// Creates a new point object.
	function Point(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}
	
	// Set up a new collision tester with the specified map (bitmap)
	// and identifier. The identifier should be unique between bounding 
	// maps, as the map itself is cached internally.
	var CollisionDetector = function(boundingMap, identifier) {
		// Store the identifier and bitmap.
		this.identifier = identifier;
		this.bitmap = boundingMap;
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
	
	CollisionDetector.prototype.getTranslation = function(proposedRect, previousRect) {
		return new tfn.Vector2D(proposedRect.x - previousRect.x, proposedRect.y - previousRect.y);
	}
	
	CollisionDetector.prototype.getTranslatedRect = function(rect, translationX, translationY) {
		// function Rect(x, y, width, height, rotation, anchorPoint);
		var translatedRect = new tfn.Rect(rect.x, rect.y, rect.width, rect.height, rect.rotation, rect.anchorPoint);
		translatedRect.x += translationX;
		translatedRect.y += translationY;
		return translatedRect;
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
	CollisionDetector.prototype.bline = function(x0, y0, x1, y1, resolution) {
		var p = [];
		
		x0 = Math.round(x0);
		y0 = Math.round(y0);
		x1 = Math.round(x1);
		y1 = Math.round(y1);
		
		var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
		var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1; 
		var err = (dx > dy ? dx : -dy) / 2;
					
		var iteration = 0;
		while (true) {
			if (iteration % resolution == 0) {
				p.push(new Point(x0, y0));
			}
			
			if (x0 === x1 && y0 === y1) break;
			var e2 = err;
			
			if (e2 > -dx) { err -= dy; x0 += sx; }
			if (e2 < dy) { err += dx; y0 += sy; }
			iteration++;
		}
		
		return p;
	}
	
	// Returns an array of points, sorted in no particular order.
	//
	// The array contains not only the four corner points, but
	// additional points that are interpolated.
	CollisionDetector.prototype.createIntermediatePoints = function(rotatedRect) {
		var resolution = 5;
		
		var p12Interpolations = this.bline(rotatedRect.p1.x, rotatedRect.p1.y, rotatedRect.p2.x, rotatedRect.p2.y, resolution);
		var p23Interpolations = this.bline(rotatedRect.p2.x, rotatedRect.p2.y, rotatedRect.p3.x, rotatedRect.p3.y, resolution);
		var p34Interpolations = this.bline(rotatedRect.p3.x, rotatedRect.p3.y, rotatedRect.p4.x, rotatedRect.p4.y, resolution);
		var p41Interpolations = this.bline(rotatedRect.p4.x, rotatedRect.p4.y, rotatedRect.p1.x, rotatedRect.p1.y, resolution);
		
		return p12Interpolations.concat(p23Interpolations).concat(p34Interpolations).concat(p41Interpolations);
	}
	
	// Returns the center point from the rotated rect.
	CollisionDetector.prototype.calculateCenterPoint = function(minX, minY, maxX, maxY) {
		var point = new Point();
		point.x = (minX + maxX) / 2;
		point.y = (minY + maxY) / 2;
		return point;
	}
	
	CollisionDetector.prototype.checkCollision = function(rect, relativeAnchorPoint) {		
		// Derive the collision rect from the regular rect.
		var collisionRect = this.getCollisionRect(rect, relativeAnchorPoint);
		
		// Calculate the rotated rects derived from individual rotation
		// of the four points.
		var rotatedRect = this.createRotatedRect(collisionRect, relativeAnchorPoint, rect.rotation);
		
		// Create a list of points that are created via interpolation
		// between the points on the rotated rect.
		var edgePoints = this.createIntermediatePoints(rotatedRect);

		// The point at which there is a collision, if any.
		var collisionPoint = null;
		
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
			// and the 4th is alpha. This means index + 3 is
			// the alpha channel.
			//
			// TODO: alpha channel not working properly? Checking
			// blue for now.
			if (pixelDataCache[this.identifier][imageDataIndex + 3]) {
				collisionPoint = point;
				break;
			}
		}
		
		return collisionPoint;
	}
	
	CollisionDetector.prototype.determineOpenRect = function(rectProposed, rectPrevious) {
		// Get the relative anchor point from the object.
		//
		// This will be transposted into a global point later. 
		var r = rectPrevious;
		var relativeAnchorPoint = new Point(r.anchorPoint.x * r.width, r.anchorPoint.y * r.height);
		
		// The translation is given from the previous rect, and the
		// proposed rect is given as guidance.
		var translation = this.getTranslation(rectProposed, rectPrevious);
		
		// First check proposed rect as the fast path.
		if (!this.checkCollision(rectProposed, relativeAnchorPoint)) {
			// No collision for the proposed rect, so let it happen.
			return rectProposed;
		}

		// So we now know the proposed rect isn't going to be availiable.
		//
		// The next step is to figure out which axis (if any) has a safe
		// movement path available by manipulating the translation.
		//
		// First check to see if we are able to move only on the y-axis.
		var yTranslatedRect = this.getTranslatedRect(rectPrevious, 0, translation.y);
		if (!this.checkCollision(yTranslatedRect, relativeAnchorPoint)) {
			// We can move along the y-axis safely, so return
			// the modified rect.
			return yTranslatedRect;
		}
		
		// Our last check is to see whether we can move along the
		// x-axis.
		var xTranslatedRect = this.getTranslatedRect(rectPrevious, translation.x, 0);
		if (!this.checkCollision(xTranslatedRect, relativeAnchorPoint)) {
			return xTranslatedRect;
		}
		
		// We can't move anywhere safely, so maintain the previous rect.
		return rectPrevious;
	}
	
	CollisionDetector.prototype.collisionEdge = {
		TOP : 0,
		BOTTOM: 1,
		LEFT : 2,
		RIGHT : 3,
		NONE : 4
	}
	
	CollisionDetector.prototype.determineCollisionEdge = function(currentRect) {
		// Get the relative anchor point.
		var r = currentRect;
		var relativeAnchorPoint = new Point(r.anchorPoint.x * r.width, r.anchorPoint.y * r.height);
		
		// Determine the point of collision.
		var collisionPoint = this.checkCollision(currentRect, relativeAnchorPoint);
		
		// If no collision, early bail (fast path).
		if (!collisionPoint) {
			return this.collisionEdge.NONE;
		}		
		
		// Calculate the rotated rect.
		var collisionRect = this.getCollisionRect(currentRect, relativeAnchorPoint);
 		var rotatedRect = this.createRotatedRect(collisionRect, relativeAnchorPoint, currentRect.rotation);		
		
		// Define a sorter for X values, from least to greatest.
		function sortByX(p1, p2) {
			if (p1.x < p2.x) return -1;
			if (p1.x > p2.x) return 1;
			return 0;
		}
		
		// Then a sorter for Y values, from least to greatest.
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
		
		// Calculate the midpoint of the rect.
		var midpoint = new Point();
		midpoint.x = sortedByX[0].x + (sortedByX[3].x - sortedByX[0].x) / 2;
		midpoint.y = sortedByY[0].y + (sortedByY[3].y - sortedByY[0].y) / 2;
		
		var thresholdX = (sortedByX[3].x - sortedByX[0].x) / 4;
		var thresholdY = (sortedByY[3].y - sortedByY[0].y) / 4;
		
		if (collisionPoint.y < midpoint.y - thresholdY) {
			return this.collisionEdge.TOP;
		} else if (collisionPoint.y > midpoint.y + thresholdY) {
			return this.collisionEdge.BOTTOM;
		} else if (collisionPoint.x < midpoint.x - thresholdX) {
			return this.collisionEdge.LEFT;
		} else if (collisionPoint.x > midpoint.x + thresholdX) {
			return this.collisionEdge.RIGHT;
		} else {
			console.log("Faulty collision. middle: " + JSON.stringify(midpoint) + " collision: " + JSON.stringify(collisionPoint));
		}
	}
	
	tfn.CollisionDetector = CollisionDetector;
})();
