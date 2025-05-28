#include<ESP8266WiFi.h>
#include "DHTesp.h"
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <MFRC522v2.h>
#include <MFRC522DriverSPI.h>
#include <MFRC522DriverPinSimple.h>
#include <MFRC522Debug.h>
#include <Servo.h>
#include <LiquidCrystal_I2C.h>
#define BUTTON_PIN D0

// set the LCD number of columns and rows
int lcdColumns = 16;
int lcdRows = 2;
String uidString = "";

// set LCD address, number of columns and rows
// if you don't know your display address, run an I2C scanner sketch
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);  

Servo myservo;

// Learn more about using SPI/I2C or check the pin assigment for your board: https://github.com/OSSLibraries/Arduino_MFRC522v2#pin-layout
MFRC522DriverPinSimple ss_pin(15);

MFRC522DriverSPI driver{ss_pin}; // Create SPI driver
//MFRC522DriverI2C driver{};     // Create I2C driver
MFRC522 mfrc522{driver};         // Create MFRC522 instance

int trigPin = D1;    // Trigger
int echoPin = D0;    // Echo
int button = D0;
int led = D3;
long duration, cm, inches;
int opened = false;
String amount ="000";

#define DHTpin 2
DHTesp dht;
//----Thay đổi thành thông tin của bạn---------------
const char* ssid = "TP-Link_847E";      //Wifi connect
const char* password = "39926227";   //Password

const char* mqtt_server = "76bf78e5731240cbb090e3284089c085.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_username = "carController"; //User
const char* mqtt_password = "Khaito4224!"; //Password
//--------------------------------------------------
WiFiClientSecure espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
//------------Connect to MQTT Broker-----------------------------
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientID =  "ESPClient-";
    clientID += String(random(0xffff),HEX);
    if (client.connect(clientID.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");
      client.subscribe("esp8266/client");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
//-----Call back Method for Receiving MQTT massage---------
void callback(char* topic, byte* payload, unsigned int length) {
  String incommingMessage = "";
  for(int i=0; i<length;i++) incommingMessage += (char)payload[i];
  // {"message":"open"}
  if(incommingMessage.substring(12,16) == "open") {
    opened = true;
  }
  // {"message":"clos"}
  if(incommingMessage.substring(12,16) == "clos") {
    opened = false;
  }
  // {"message":"clos","amount":"120"}
  if(amount != incommingMessage.substring(28,31)){
    amount = incommingMessage.substring(28,31);
    lcd.print(amount);
  }
  
  Serial.println("Massage arived ["+String(topic)+"]"+incommingMessage + "amount = " + amount);
}
//-----Method for Publishing MQTT Messages---------
void publishMessage(const char* topic, String payload, boolean retained){
  if(client.publish(topic,payload.c_str(),true))
    Serial.println("Message published ["+String(topic)+"]: "+payload);
}


void setup() {
  pinMode(button, INPUT); 
  pinMode(led,OUTPUT); 
    // initialize LCD
  lcd.init();
  // turn on LCD backlight                      
  lcd.backlight();
  pinMode(BUTTON_PIN, INPUT); 
  Serial.begin(9600);
  while(!Serial) delay(1);

  mfrc522.PCD_Init();    // Init MFRC522 board.
  MFRC522Debug::PCD_DumpVersionToSerial(mfrc522, Serial);	// Show details of PCD - MFRC522 Card Reader details.
	Serial.println(F("Scan PICC to see UID"));

  myservo.attach(D4);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  dht.setup(DHTpin,DHTesp::DHT11);

  setup_wifi();
  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

}
void callClient(){
  {
      DynamicJsonDocument doc_2(1024);
    char mqtt_message_2[128];
    doc_2["RFID"]= uidString;
    doc_2["opened"] = opened;
    serializeJson(doc_2,mqtt_message_2);
    publishMessage("esp8266/data_rfid", mqtt_message_2, true);
    }
}
unsigned long timeUpdata=millis();
int pos = 0;
bool current_opened = opened;
void loop() {
  int buttonStatus = digitalRead(button);    //Đọc trạng thái button
  if (buttonStatus == HIGH) { // Nếu mà button bị nhấn
    digitalWrite(led,HIGH); // Đèn led sáng
    opened = !opened;
  } else { // ngược lại
    digitalWrite(led,LOW);
  }
  lcd.setCursor(0, 0);
  // print message
  lcd.print("Ham Chung cu:");

  lcd.setCursor(8,1);

  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  // Servo
  if(millis()-timeUpdata>15){
  if(opened)
    {
      if(pos <= 180) {
        pos +=1;
        myservo.write(pos);
      } 
    } else {
      if(pos >= 0) {
        pos -=1;
        myservo.write(pos);
      }
    }
  }
  if(opened) return;
  // RFID
  if (!mfrc522.PICC_IsNewCardPresent()) {
		return;
	}

	// Select one of the cards.
	if (!mfrc522.PICC_ReadCardSerial()) {
		return;
	}
  // MFRC522Debug::PrintUID(Serial, (mfrc522.uid));

  
  // Save the UID on a String variable
  uidString = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) {
      uidString += "0"; 
    }
    uidString += String(mfrc522.uid.uidByte[i], HEX);
  }
  DynamicJsonDocument doc(1024);
  char mqtt_message[128];
  doc["RFID"]= uidString;
  opened = true;
  doc["opened"] = opened;
  serializeJson(doc,mqtt_message);
  publishMessage("esp8266/data_rfid", mqtt_message, true);

 
}
