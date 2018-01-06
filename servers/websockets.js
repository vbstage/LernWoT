var wsServer = require('ws').Server,
    resources = require('./../resources/model');

exports.listen = function (server) {
    var wss = new wsServer({
        server: server
    });

    console.info('Websocket server started...');

    wss.on('connection', function (ws) {
        var url = ws.upgradeReq.url;

        console.info(url);

        try {
            observe(selectResource(url), function (changes) {
                ws.send(JSON.stringify(changes), function () {
                });
            });
        } catch (e) {
            console.log('Unable to observe %s resource!', url);
        }
    });
};

function selectResource(url) {
    var parts = url.split('/');
    parts.shift();

    var result = resources;
    for (var i = 0; i < parts.length; i++) {
        result = result[parts[i]];
    }

    return result;
}

function observe(resource, cb) {
    var myEmitter = new EventEmitter();

    myEmitter.on('changes', function (val) {
        cb(val);
    });

    var value = resource,
        observer = setInterval.call(
            this,
            function () {
                if (value !== resource.value) {
                    value = resource.value;
                    myEmitter.emit('changes', resource);
                }
            },
            250);
}







