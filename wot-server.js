var wot = {
    run: function() {

        var httpServer = require('./servers/http'),
            wsServer = require('./servers/websockets'),
            resources = require('./resources/model');

        var ledsPlugin = require('./plugins/internal/ledsPlugin'),
            pirPlugin = require('./plugins/internal/pirPlugin'),
            dhtPlugin = require('./plugins/internal/DHT22SensorPlugin');

        ledsPlugin.start({'simulate': false, 'frequency': 7000});
        pirPlugin.start({'simulate': true, 'frequency': 3000});
        dhtPlugin.start({'simulate': false, 'frequency': 5000});

        var server = httpServer.listen(resources.pi.port, function() {
           console.log('HTTP server started...');

           wsServer.listen(server);
           console.info('WoT Pi is up & running on port %s', resources.pi.port);
        });
    }
};

module.exports = wot;
