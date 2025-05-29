var mqtt = require('mqtt');
const ResidentVehicle = require('./models/ResidentVehicle');
const ParkingRecord = require('./models/ParkingRecord');

const mqttController = () => {
  // MQTT connection options
  var options = {
    host: '76bf78e5731240cbb090e3284089c085.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'carController',
    password: 'Khaito4224!'
  }

  // Initialize the MQTT client
  var client = mqtt.connect(options);

  // Setup the callbacks
  client.on('connect', function () {
    console.log('Connected to MQTT broker');
  });

  client.on('error', function (error) {
    console.log('MQTT Error:', error);
  });

  client.on('message', async function (topic, message) {
    if (topic === 'esp8266/data_rfid' && message.toString()!== "") {
      try {
        const data = JSON.parse(message.toString());
        const rfid = data.RFID;
        console.log('Received message from esp8266:', topic, rfid);

        const vehicle = await ResidentVehicle.findOne({ rfidTag: rfid });
            if (vehicle) {
            // Kiểm tra bản ghi ParkingRecord hiện tại của vehicleId này
            const lastRecord = await ParkingRecord.findOne({
              vehicleId: vehicle._id,
            }).sort({ entryTime: -1 });

            if (!lastRecord || (lastRecord.entryTime && lastRecord.exitTime)) {
              // Nếu chưa có bản ghi hoặc bản ghi trước đã hoàn thành (có entryTime và exitTime)
              const newRecord = new ParkingRecord({
                vehicleId: vehicle._id,
                vehicleModel: 'ResidentVehicle',
                entryTime: new Date(),
                status: 'IN',
              });
              await newRecord.save();
              console.log('Created new IN record for vehicle:', vehicle.plateNumber);
            } else if (lastRecord.entryTime && !lastRecord.exitTime) {
              // Nếu đã có entryTime nhưng chưa có exitTime
              lastRecord.exitTime = new Date();
              lastRecord.status = 'OUT';
              await lastRecord.save();
              console.log('Updated record to OUT for vehicle:', vehicle.plateNumber);
            }
          }
          const count = await ParkingRecord.countDocuments({ status: 'IN' });
          console.log('Current IN count:', count);
          const messagetoString =  '{"message":"open","amount":"' + count.toString().padStart(3, '0') +'}';
        client.publish('esp8266/client', messagetoString);
      } catch (err) {
        console.log('Error processing message:', err);
      }
    }
  });

  // Subscribe to topic 'esp8266/data_rfid'
  client.subscribe('esp8266/data_rfid');
}
const openDoor = () =>{
  var options = {
    host: '76bf78e5731240cbb090e3284089c085.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'carController',
    password: 'Khaito4224!'
  } 
  var client = mqtt.connect(options);

  client.on('connect', function () {
    console.log('Connected to MQTT broker');
    client.publish('esp8266/client', '{"message":"open"}');
    client.end();
  });
}
const closeDoor = () =>{
  var options = {
    host: '76bf78e5731240cbb090e3284089c085.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'carController',
    password: 'Khaito4224!'
  } 
  var client = mqtt.connect(options);

  client.on('connect', function () {
    console.log('Connected to MQTT broker');
    client.publish('esp8266/client', '{"message":"clos"}');
    client.end();
  });
}
module.exports = {mqttController, openDoor, closeDoor};