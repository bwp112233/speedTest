//jshint esversion: 8
const express = require('express');
const app = express();
const cmd = require('node-cmd');
const mongoose = require('mongoose');
const ejs = require('ejs');
const password = require(__dirname +'/password');
let info, finish;
let array = [];

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json({
  type: ['application/json', 'text/plain']
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect(`mongodb+srv://admin:${password.password}@rocketdb-kfgku.mongodb.net/speedtest?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const resultSchema = new mongoose.Schema({
  _id: String,
  type: String,
  timestamp: String,
  ping: Object,
  download: Object,
  upload: Object,
  packetLoss: Number,
  interface: Object,
  server: Object,
  result: Object
});

const Results = mongoose.model('results', resultSchema);

init();
setInterval(function() {
init();
}, 3600000);

function init() {
  cmd.get(
    'speedtest -f json',
    function(err, data, stderr) {
      if(data != undefined) {
      let result = JSON.parse(data);
      let results = new Results({
        _id: result.result.id,
        type: result.type,
        timestamp: new Date(),
        sortTime: Date.now(),
        ping: {
          jitter: result.ping.jitter,
          latency: result.ping.latency
        },
        download: {
          bandwidth: result.download.bandwidth,
          bytes: result.download.bytes,
          megabytes: (result.download.bandwidth) / 1000000,
          elapsed: result.download.elapsed
        },
        upload: {
          bandwidth: result.upload.bandwidth,
          bytes: result.upload.bytes,

          elapsed: result.upload.elapsed
        },
        packetLoss: result.packetLoss,
        interface: {
          externalIp: result.interface.externalIp
        },
        server: {
          id: result.server.id,
          name: result.server.name,
          location: result.server.location,
          country: result.server.country,
          host: result.server.host,
          port: result.server.port,
          ip: result.server.ip
        },
        result: {
          id: result.result.id,
          url: result.result.url
        }
      });
      results.save();
      console.log(results);
    }
  }
  );
}

app.get('/', async function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/data', async function (req, res) {
  array = [];
  await dataSearch(req.body.date);
  res.send(finish);
});

function dataSearch(date) {
  return new Promise((resolve, reject) => {
    Results.find({
      timestamp: {
        $regex: date,
        $options: 'i'
      }
    }, function (err, data) {
      finish = data;
      resolve(finish);

    }, function (err) {
      if (!err) {
        console.log('status');
      }
    });
  });
}
app.listen(3500, function () {
  console.log(`Server started on port 3500`);
});
