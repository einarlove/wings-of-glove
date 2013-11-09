function gloveInputs(data){
	var x = game.de2ra(data.x) || 0;
	var y = game.de2ra(data.y) || 0;
	var z = game.de2ra(data.z) || 0;
	player.move({
		x:x,
		y:y,
		z:z
	})
}

var keyactive = {};
function keydown(event){
	keyactive[event.keyCode] = true;
}
function keyup(event){
	keyactive[event.keyCode] = false;
}

window.keyData = {x:0, y:0, z:0};
function getKeyInputs(){
	var speed = 10;
	// Keycodes
	var left = 37;
	var top = 38;
	var right = 39;
	var down = 40;

	if( keyactive[left] )  keyData.x -= speed;
	if( keyactive[right] ) keyData.x += speed;
	if( keyactive[top] )   keyData.z -= speed;
	if( keyactive[down] )  keyData.z += speed;
	player.goto(keyData);
}