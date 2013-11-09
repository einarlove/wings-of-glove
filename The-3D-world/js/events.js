events = {
	useGlove: true,
	keyActive: {},
	buttons: {
		left:  37,
		top:   38,
		right: 39,
		bottom:  40
	},
	gloveData: {
		x: 0,
		y: 0,
		z: 0,
		button: false
	},
	keydown: function(e){
		var key = e.keyCode;
		events.keyActive[key] = true;
	},
	keyup: function(e){
		var key = e.keyCode;
		events.keyActive[key] = false;
	},
	gloveInput: function(data){
		events.gloveMovement = true;
		if(events.useGlove) events.gloveData = data;
	},
	isDown: function(name){
		if(events.keyActive[events.buttons[name]])
			return true;
		else if(typeof name === "Number" && events.keyActive[name])
			return true;
		else
			return false;
	}
}