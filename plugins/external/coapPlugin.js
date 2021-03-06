var utils = require('./../../utils/utils'),
    resources = require('./../../resources/model');

var interval,
    me,
    pluginName,
    pollInterval;

var localParams = {
    'simulate': false,
    'frequency': 5000
};

function connectHardware() {
    var coap = require('coap'),
        bl = require('bl');

    var sensor = {
        read: function () {
            coap.request({
                host: 'localhost',
                port: 5683,
                pathname: '/co2',
                options: {'Accept': 'application/json'}
            })
                .on('response', function (res) {
                    console.info('CoAP response code %s', res.code);

                    if (res.code !== '2.05')
                        console.log("Error while contacting CoAP service: %s", res.code);

                    res.pipe( bl(function (err, data) {
                        var json = JSON.parse(data);
                        me.value = json.co2;
                        showValue();
                    }));
                })
                .end();
        }
    };

    pollInterval = setInterval(function() {
        sensor.read();
    }, localParams.frequency);
}

function configure() {
    utils.addDevice(
        'coapDevice',
        'A CoAP Device',
        'A CoAP Device',
        {
            'co2' : {
                'name' : 'CO2 Sensor',
                'description' : 'An ambient CO2 sensor',
                'value' : 0
            }
        });
    me = resources.things.coapDevice.sensors.co2;
    pluginName = resources.things.coapDevice.name;
}

exports.start = function(params, app) {
  localParams = params;
  configure(app);

  if(params.simulate) {
      simulate();
  } else {
      connectHardware();
  }
};

exports.stop = function() {
  if(params.simulate) {
      clearInterval(interval);
  } else {
      clearInterval(pollInterval);
  }

  console.info('%s plugin stopped!', pluginName);
};

function simulate() {
    interval = setInterval(function() {
       me.value = utils.randomInt(0, 1000);
       showValue();
    }, localParams.frequency);

    console.info('Simulated %s sensor started', pluginName);
}

function showValue() {
    console.info('CO2 Level: %s ppm', me.value);
}








