// Import the required modules
const { SerialPort } = require("serialport");
const Readline = require("@serialport/parser-readline").Readline; // Correct way to import Readline
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Updated port path
const port = new SerialPort({ path: "/dev/tty.usbserial-110", baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: "\n" }));

let sensorData = { temp: 0, hum: 0, thermal: 0 };

// Read data from Arduino
parser.on("data", (line) => {
  const matches = line.match(
    /Temp:\s([0-9.]+)C,\sHum:\s([0-9.]+),\sThermal:\s([0-9.]+)/
  );
  if (matches) {
    sensorData = {
      temp: parseFloat(matches[1]),
      hum: parseFloat(matches[2]),
      thermal: parseFloat(matches[3]),
    };
  }
});

// API endpoint to get the latest sensor data
app.get("/sensor-data", (req, res) => {
  res.json(sensorData);
});

app.listen(3001, () =>
  console.log("Server is running on http://localhost:3001")
);
