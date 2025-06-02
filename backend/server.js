// Import 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


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
// Initialize MQTT controller
// const {mqttController,openDoor, closeDoor} = require('./Mqtt-controller');

// mqttController();
// app.use("/door/open",openDoor);
// app.use("/door/close",closeDoor);

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/users",userRoute);
app.use("/api/apartments", apartmentRoute);
app.use("/api/vehicles/resident",residentRoute);
app.use("/api/parking",parkingRoute);
// Define a route
app.get('/', (req, res) => {
    res.send(`Welcome to the Express.js Tutorial ${PORT}`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

