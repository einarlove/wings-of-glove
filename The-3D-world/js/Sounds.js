function Sounds() {
	"use strict";

	var o = {};

	function addSound(name, volume, loop) {
		o[name] = new Audio("sounds/" + name + ".mp3");
		o[name].loop = loop === undefined ? true : false;
		o[name].volume = volume || 0;
		o[name].play();
	}

	addSound("music", 0.5);
	addSound("forest");
	addSound("wind");
	addSound("wing", 0.2, false);

	o.wingFlap = function() {
			o.wing.play();
			o.wing.currentTime = 0;
	}

	o.setSoundTransition = function(transition) {
		//0 == low, 1 == high
		var volume = transition;
		if(volume >= 1) volume = 1;

		o.wind.volume = volume;
		o.forest.volume = 1 - volume;
	}

	return o;
}

