// Import 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
var mqtt = require('mqtt')

// Route
const userRoute = require("./routes/userRoutes");
const apartmentRoute = require("./routes/apartmentRoutes");
const residentRoute = require("./routes/residentVehicleRoutes")
const parkingRoute  = require("./routes/parkingRoutes")

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const URI = process.env.ATLAS_URI;

mongoose.connect(URI, { useNewUrlParser: true,useUnifiedTopology: true })
.then(() =>console.log("Connected to MongoDB"))
        .catch(err => console.log("Error connecting to MongoDB"));
// MQTT
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
    if (topic === 'esp8266/data_rfid') {
    console.log('Received message dht11:', topic, message.toString());
    client.publish('esp8266/client', '{"message":"open","amount":"136"}');
  }
    
   
});

// subscribe to topic 'my/test/topic'
client.subscribe('esp8266/data_rfid');





// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users",userRoute);
app.use("/api/apartments", apartmentRoute);
app.use("/api/resident-vehicles",residentRoute);
app.use("/api/parking",parkingRoute);
// Define a route
app.get('/', (req, res) => {
    res.send(`Welcome to the Express.js Tutorial ${PORT}`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

