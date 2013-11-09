"use strict";

exports.toObject = function(rawdata) {
  var data = rawdata.split(";"),
      obj = {};
  
  data.forEach(function(prop) {
    var colonPos, propName, val;
  
    colonPos = prop.indexOf(":");
    if (colonPos === -1) { return; }
  
    propName = prop.substring(0,colonPos);
    val = prop.substring(colonPos+1);
    
    if (val === "true") val = true;
    else if (val === "false") val = false;
    if ( !isNaN(parseInt(val)) ) val = parseInt(val);
  
    obj[propName] = val;
  });
  
  return obj;
}

exports.toArduino = function(obj) {
  var str = "";
  
  for (var prop in obj) {
    str += prop;
    str += ":"
    str += obj[prop];
    str += ";";
  }
  
  return str;
}