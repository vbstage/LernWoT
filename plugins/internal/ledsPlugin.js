var resources = require('./../../resources/model');

var actuator,
    interval;

var model = resources.pi.actuators.leds['1'];
var pluginName = model.name;
var localParams = {
    'simulate': false,
    'frequence': 2000
};

