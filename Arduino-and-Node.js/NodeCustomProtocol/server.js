"use strict";

var glove = new require("./glove.js").glove(),
	net = new require("./net.js").net();

glove.recive = function(obj) {
	var objForSending = getObjectForSending(obj);
	
	if (net.isConnected) {
		net.send(objForSending);
	}
};

net.recive = function(obj) {
	if (glove.isConnected) {
		glove.send(obj);
		
		if(obj.callibrate) {
			callibrate = true;
		}
	}
};

var zeroPoints = {
	x: 475,
	y: 475
}

function getObjectForSending(obj) {
	// X and Y is swtiched because Y on the accel is X in the game
	
	if (callibrate) {
		zeroPoints.x = obj.x;
		zeroPoints.y = obj.y;
		callibrate = false;
	}
	
	var o = {
		x: -adjustAccelNum(obj.y, zeroPoints.y),
		z: -adjustAccelNum(obj.x, zeroPoints.x),
		button: obj.btn || false,
	};
	
	return o;
}

var limit = 100,
	degreeAdjust = -10, //Assumes limit is 100
	callibrate = false;
function adjustAccelNum(_accelNum, zeroPoint) {
	var accelNum = _accelNum;
	accelNum -= zeroPoint; // Accelometer goes from 0 to 1023
	if (accelNum > limit) accelNum = limit;
	else if (accelNum < -limit) accelNum = -limit;
	
	// Extremely primitive degrees adjust
	// accelNum += degreeAdjust;
	
	return -accelNum;
}

