"use strict";

var SerialPort = require("serialport").SerialPort,
    objectConverter = require("./gloveObjectConverter");

var ports = {
  air: {
    leftUSB: "/dev/tty.usbmodemfd121",
    rightUSB: "/dev/tty.usbmodemfa131",
    xbee: "/dev/tty.usbserial-A800f3aE"
  },
  imac: {
    lastUSB: "/dev/tty.usbmodem411",
    xbee: "/dev/tty.usbserial-A601EN4Y"
  }
};

exports.glove = function() {
  var g = {};
  
  var serialPort = new SerialPort(ports.imac.xbee, {
    baudrate: 19200
  });
  
  g.recive = function(obj) {
    console.log("OBJECT RECIVER NOT SET");
  }
  
  g.isConnected = false;
  g.connected = function(obj) {
    g.isConnected = true;
  }
  
  g.send = function(obj) {
    var data = "s;" + objectConverter.toArduino(obj);
    writeln(data);
    // console.log("Sendt to glove: " + data);
  }
  
  function writeln(data) {
    serialPort.write(data + "\r\n");
  }
  
  serialPort.on("open", function() {
    console.log("serial open");
    g.connected();
    serialPort.on("data", serialPort_on_data);
  });
  
  var buffer = "";
  function serialPort_on_data(data) {
    buffer += data;
    
    // Check that buffer is valid data
    if ( (buffer.indexOf("\r") !== -1) && (buffer.indexOf("\r\nx" === -1)) ) {
      
      //Check if buffer is object
      if (buffer.indexOf("s;") !== -1) {
        var obj = objectConverter.toObject(buffer);
        g.recive(obj);
        buffer = "";
      }
      else {
        console.log(buffer);
        buffer = "";
      }
      
    }

    
  }
  
  return g;
}