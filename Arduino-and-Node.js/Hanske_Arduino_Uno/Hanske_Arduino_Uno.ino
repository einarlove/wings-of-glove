#include <TinkerKit.h>

int const iterationsPerSend = 8;

void setup() {
	Serial.begin(19200);
}

int iteration = 0;
void loop() {
	boolean tock = iteration > iterationsPerSend;
	
	iterateRecive(tock);
	iterateSend(tock);
	
	if (tock) iteration = 0;
	else iteration++;
	
	delay(15);
}
