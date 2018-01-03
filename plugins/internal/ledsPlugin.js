var EventEmitter = require('events');

var resources = require('./../../resources/model');

var actuator,
    interval,
    observer;

var model = resources.pi.actuators.leds['1'];
var pluginName = model.name;
var localParams = {
    'simulate': false,
    'frequency': 2000
};

exports.start = function (params) {
  localParams = params;
  observe(model);

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
      actuator.unexport();
  }

  clearInterval(observer);

  console.info('%s plugin stopped!', pluginName);
};

function observe(what) {
    var myEmitter = new EventEmitter();

    myEmitter.on('changes', function(value) {
        switchOnOff(value);
    });

    var value = model.value;
    observer = setInterval.call(
        this,
        function() {
            if(value !== model.value) {
                console.info('Changes detected by plugin for %s...', pluginName);

                value = model.value;
                myEmitter.emit('changes', value);
            }
        },
        500);
}

function switchOnOff(value) {
    if(!localParams.simulate) {
        actuator.write(value === true ? 1 : 0, function() {
           console.info('Changed value of %s to %s', pluginName, value);
        });
    }
}

function connectHardware() {
    var Gpio = require('onoff').Gpio;
    actuator = new Gpio(model.gpio, 'out');

    console.info('Hardware %s actuator started!', pluginName);
}

function simulate() {
    interval = setInterval(function() {
       if(model.value) {
           model.value = false;
       } else {
           model.value = true;
       }
    }, localParams.frequency);

    console.info('Simulated %s actiator started', pluginName);
}












