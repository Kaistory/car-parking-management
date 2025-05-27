var mqtt = require('mqtt')

var options = {
    host: '76bf78e5731240cbb090e3284089c085.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'carController',
    password: 'Khaito4224!'
}

// initialize the MQTT client
var client = mqtt.connect(options);

// setup the callbacks
client.on('connect', function () {
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {
    // called each time a message is received
    if (topic === 'esp8266/dht11') {
    console.log('Received message dht11:', topic, message.toString());
  }

  if (topic === 'my/test/topic') {
    console.log('Received message mytopic:', topic, message.toString());
  }
    
   
});

// subscribe to topic 'my/test/topic'
client.subscribe('esp8266/dht11');
client.subscribe('my/test/topic');

// publish message 'Hello' to topic 'my/test/topic'
client.publish('my/test/topic', 'Hello');