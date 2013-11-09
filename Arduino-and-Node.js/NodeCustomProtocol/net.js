"use strict";

var http = require("http"),
	socketio = require("socket.io"),
	fs = require("fs");

exports.net = function() {
	var n = {};
	
	var app = http.createServer(handler),
		io = socketio.listen(app);
	
	app.listen(3000);
	
	function handler(req, res) {
		fs.readFile(__dirname + "/index.html", function(err, data) {
			if (err) {
				res.writeHead(200);
				res.end("Error loading index.html");
			}
			
			res.writeHead(200);
			res.end(data);
		});
	}
	
	n.isConnected = false;
	io.sockets.on('connection', function(socket) {
		n.isConnected = true;
		
		socket.on("toServer", function(data) {
			n.recive(data);
		})
	});
	
	n.recive = function(obj) {
		console.log("NET RECIVER NOT SET");
	};
	
	n.send = function(obj) {
		io.sockets.emit("toGame", obj);
	};
	
	return n;
}