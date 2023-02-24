const mqtt = require('mqtt');
const express = require('express');
const mongoose = require('mongoose');
const randomCoordinates = require('random-coordinates');
const app = express();
const port = 5001;
app.use(express.static('public'));
mongoose.connect('mongodb+srv://armaan:armaan@cluster0.paruxml.mongodb.net/mydb', {useNewUrlParser: true, useUnifiedTopology: true });
const bodyParser = require('body-parser');



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended: true
}));

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

client.on('connect', () => { 
    client.subscribe('/sensorData');
    console.log('mqtt connected');
});
// client.on('message', (topic, message) => {
//     if (topic == '/sensorData') {
//       console.log(`Received message: ${message}`);
//     }
//   });
//   client.on('message', (topic, message) => {
//     if (topic == '/sensorData') {
//         var string = JSON.stringify(message);
//       const data = JSON.parse(string);
//       console.log(data);
//     }
//   });
  client.on('message', (topic, message) => {
    if (topic == '/sensorData') {
      //var string = JSON.stringify(message);
      const data = JSON.parse(message);
  
      Device.findOne({"name": data.deviceId }, (err, device) => {
        if (err) {
          console.log(err)
        }
  
        const { sensorData } = device;
        const { ts, loc, temp } = data;
  
        sensorData.push({ ts, loc, temp });
        device.sensorData = sensorData;
  
        device.save(err => {
          if (err) {
            console.log(err)
          }
        });
      });
    }
  });


app.post('/send-command', (req, res) => {
    const { deviceId, command }  = req.body;
    const topic = `/myid/command/${deviceId}`;
    client.publish(topic, command, () => {
      res.send('published new message');
    });
  });
//   client.publish(topic, command, () => {
//     res.send('published new message');
//   });
app.put('/sensor-data', (req, res) => {
    const { deviceId }  = req.body;
  
    const [lat, lon] = randomCoordinates().split(", ");
    const ts = new Date().getTime();
    const loc = { lat, lon };
    min = Math.ceil(20);
    max = Math.floor(50);
    temp = Math.floor(Math.random() * (max - min + 1) + min);
  
    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });
  
    client.publish(topic, message, () => {
      res.send('published new message');
    });
  });

app.listen(port, () => { 
    console.log(`listening on port ${port}`);
});