const express = require('express');
const mongoose = require('mongoose');
const Device = require('./models/device'); 
mongoose.connect('mongodb+srv://armaan:armaan@cluster0.paruxml.mongodb.net/mydb', {useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static(`${__dirname}/public/generated-docs`));

app.get('/docs', (req, res) => { //it sets up the GET route with the given path 
  res.sendFile(`${__dirname}/public/generated-docs/index.html`); // the file is sent which is mentioned in the path 
}); // when the request is made by the client then the response is made which sends this file
const port = 5000;


// app.get('/api/test', (req, res) => {
//   res.send('The API is working!');
// });

// app.get('/api/devices', (req, res) => {
//   Device.find({}, (err, devices) => {
//     console.log(devices);
//   });
// });
// app.get('/api/devices', (req, res) => {
//   Device.find({}, (err, devices) => {
//     return res.send(devices);
//   });
// });
/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
*  [
*    {
*      "_id": "dsohsdohsdofhsofhosfhsofh",
*      "name": "Mary's iPhone",
*      "user": "mary",
*      "sensorData": [
*        {
*          "ts": "1529542230",
*          "temp": 12,
*          "loc": {
*            "lat": -37.84674,
*            "lon": 145.115113
*          }
*        },
*        {
*          "ts": "1529572230",
*          "temp": 17,
*          "loc": {
*            "lat": -37.850026,
*            "lon": 145.117683
*          }
*        }
*      ]
*    }
*  ]
* @apiErrorExample {json} Error-Response:
*  {
*    "User does not exist"
*  }
*/
app.get('/api/devices', (req, res) => {
  Device.find({}, (err, devices) => {
   return err
     ? res.send(err)
     : res.send(devices);
  });
});
// app.post('/api/devices', (req, res) => {
//   console.log(req.body);
// });
// app.post('/api/devices', (req, res) => {
//   const { name, user, sensorData } = req.body;
//   const newDevice = new Device({
//     name,
//     user,
//     sensorData
//   });
// });

app.post('/api/devices', (req, res) => {
  const { name, user, sensorData } = req.body;
  const newDevice = new Device({
    name,
    user,
    sensorData
  });
  newDevice.save(err => {
    return err
      ? res.send(err)
      : res.send('successfully added device and data');
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});