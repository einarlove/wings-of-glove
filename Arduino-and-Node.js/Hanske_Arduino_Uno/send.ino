TKButton button(I4);
TKAccelerometer accelometer(I2, I3);

int accX[iterationsPerSend], accY[iterationsPerSend];
void iterateSend(boolean tock)
{
	addValues();
	if (tock) sendValues();
}

void addValues()
{
	accX[iteration] = accelometer.getXAxis();
	accY[iteration] = accelometer.getYAxis();
}

void sendValues()
{
	Serial.print("s;"); // Start indicator
		
	Serial.print("x:");
	Serial.print(getAverageFromArray(accX));
	Serial.print(";");
	
	Serial.print("y:");
	Serial.print(getAverageFromArray(accY));
	Serial.print(";");
	
	Serial.print("btn:");
	if (button.get() == HIGH) { Serial.print("true"); }
	else { Serial.print("false"); }
	Serial.print(";");
	
	Serial.println("");
}

// To avoid jerky movement and reduce static noise
int getAverageFromArray(int intArray[])
{
	int tmp = 0;
	for (int i=0; i < iterationsPerSend; i++) {
		tmp += intArray[i];
	}
	return tmp / iterationsPerSend;
}
