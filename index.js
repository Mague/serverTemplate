var cluster    = require('cluster'),
	net        = require('net'),
	conf	   = require('./conf'),
	port       = process.env.PORT || conf.port,
	fs		   = require("fs");
if (cluster.isMaster) {
	const num_processes = require('os').cpus().length;
	var   workers 		= [];

	var spawn = function(i) {
		var numReqs = 0;
		function messageHandler(msg) {
			if (msg.cmd && msg.cmd == 'notifyRequest') {
				numReqs += 1;
			}
		}
		workers[i] = cluster.fork();
		workers[i].on('message',messageHandler)
		workers[i].on('listening',() => {
			console.log("Trabajador "+i+" escuchando");
		})
	};

	for (var i = 0; i < num_processes; i++) {
		spawn(i);
	}
	var clients = []
	var aux = undefined
	var worker_index = function(ip, len) {
		var s = '';
		console.log(ip)
		for (var i = 0, _len = ip.length; i < _len; i++) {
			if (!isNaN(ip[i])) {
				s += ip[i];
			}
		}
		console.log(Number(s) % len)
		// return Number(s) % len;
		return 0;
	};
	var server = net.createServer({ pauseOnConnect: true }, function(connection) {
		console.log(connection.remoteAddress,num_processes)
		var worker = workers[worker_index(connection.remoteAddress, num_processes)];
		worker.send('sticky-session:connection', connection);
	}).listen(port,'0.0.0.0');
} else {
	var app = require('./app/http');
	var app = new app({}).expressServer

	var http = require('http')
	var server = http.createServer(app).listen(0)

	require('./app/websocket')(server)
	process.on('exit',function(code){
		console.log("proceso ",code)
	})

	process.on('message', function(message, connection) {
		if (message !== 'sticky-session:connection') {
			return;
		}
		server.emit('connection', connection);
		connection.resume();
	});
}
