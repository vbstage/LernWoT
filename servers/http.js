var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser');

var actuatorsRoutes = require('./../routes/actuators'),
    sensorRoutes = require('./../routes/sensors'),
    resources = require('./../resources/model'),
    converter = require('./../middleware/converter');

var thingsRoutes = require('./../routes/things');

var app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(function(req, res, next) {
   var date = new Date();
   console.log( date.getHours() + ':' +
                date.getMinutes() + ':' +
                date.getSeconds() +
                ' got ' + req.method + ' ' +
                req.originalUrl +' Request from: ' +
                req.hostname + ' ' +
                req.ip + ' ');

   next();
});
app.use('/pi/actuators', actuatorsRoutes);
app.use('/pi/sensors', sensorRoutes);
app.use('/things', thingsRoutes);

app.get('/pi', function(req, res) {
   res.send('This is the WoT-Pi');
});
app.use(converter());

module.exports = app;