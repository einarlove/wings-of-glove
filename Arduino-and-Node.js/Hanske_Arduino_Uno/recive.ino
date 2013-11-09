String buffer = String("");

void iterateRecive(boolean tock) {
	if (!tock) return;
	
	while(Serial.available() > 0) {
		buffer += (char)Serial.read();

		if (buffer.endsWith("\n")) {
			if (buffer.startsWith("s;")) {
				interpretData(buffer);
			}
			buffer = "";
		}
	}
}

void interpretData(String rawdata) {
	String data = rawdata.substring(2);

	while(data.indexOf(":") != -1) {
		int sepPos = data.indexOf(":"),
			endPos = data.indexOf(";");

		String prop = data.substring(0, sepPos),
			   val = data.substring(sepPos+1, endPos);
		
		// Serial.print("s;debug: prop'");
		// Serial.print(prop);
		// Serial.print("' val'");
		// Serial.print(val);
		// Serial.println("';");
		
		if (prop.equals("led")) led(val);

		String removeThis = data.substring(0, endPos+1);
		data.replace(removeThis, "");
	}
}

TKLed tkled(O3);
void led(String val) {
	if (val.equals("true")) tkled.on();
	else tkled.off();
}
