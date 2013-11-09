
// Convert degrees to radians
function deg2rad(degree){
	return degree*(Math.PI/180);
}

// Bezier curve function
function linear(x1, y1, x2, y2, t) {
	var x = (1-t) * x1 + t * x2;
	var y = (1-t) * y1 + t * y2;
	if(Math.abs(x-x2)<0.0001) x = x2; // Stop calculation when not needed
	if(Math.abs(y-y2)<0.0001) y = y2;
	return {x:x, y:y};
}

// simplified bezier curve for one property
function ease(x1, x2, t) {
	var x = (1-t) * x1 + t * x2;
	if(Math.abs(x-x2)<0.0001) x = x2; // Stop calculation when not needed
	return x;
}

// Bezier curve function for vectors
function linearVector3(o) {
	var x = (1-o.transition) * o.x.from + o.transition * o.x.to;
	var y = (1-o.transition) * o.y.from + o.transition * o.y.to;
	var z = (1-o.transition) * o.z.from + o.transition * o.z.to;
	if(Math.abs(x-o.x.to)<0.0001) x = o.x.to; // Stop calculation when not needed
	if(Math.abs(y-o.y.to)<0.0001) y = o.y.to;
	if(Math.abs(y-o.z.to)<0.0001) y = o.z.to;

	return new THREE.Vector3(x, y, z);
}
