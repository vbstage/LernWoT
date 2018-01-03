var resources = require('./../../resources/model'),
    utils = require('./../../utils/utils');

var interval,
    sensor;

var model = resources.pi.sensors;
var pluginName = 'Humidity & Temperature';
var localParams = {
    'simulate': false,
    'frequence': 5000
};

exports.start = function(params) {
  localParams = params;

  if(localParams.simulate) {
      simulate();
  } else {
      connectHardware();
  }
};

exports.stop = function() {
  if(localParams.simulate) {
      clearInterval(interval);
  } else {
      sensor.unexport();
  }

  console.info('%s plugin stopped!', pluginName);
};

function connectHardware() {
    var sensorDriver = require('node-dht-sensor');

    var HDT11 = 11;
    sensor = {
        initialize: function() {
            return sensorDriver.initialize(HDT11, model.temperature.gpio);
        },
        read: function() {
            var readout = sensorDriver.read();
            model.temperature.value = parseFloat(readout.temperature.toFixed(2));
            model.humidity.value = parseFloat(readout.humidity.toFixed(2));
            showValue();

            setTimeout(function() {
                sensor.read();
            }, localParams.frequency);
        }
    };

    if (sensor.initialize()) {
        console.info('Hardware %s sensor started!', pluginName);
        sensor.read();
    } else {
        console.warn('Failed to initialize sensor!');
    }
}

function simulate() {
    interval = setInterval(function() {
        model.temperature.value = utils.randomInt(0, 40);
        model.humidity.value = utils.randomInt(0, 100);

        showValue();
    }, localParams.frequency);

    console.info('Simulated %s sensor started', pluginName);
}

function showValue() {
    console.info('Temperature %s C, humidity %s \%',
        model.temperature.value,
        model.humidity.value);
}















