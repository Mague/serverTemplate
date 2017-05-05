const conf = require('../conf')
// const sio_redis = require('socket.io-redis')

module.exports = function(server){
	const io_conf = { transports: ['websocket', 'polling'] }
    var sio = require('socket.io')
    // var io = sio.listen(server)
    var io = sio(server,{
    	transports: ['websocket', 'polling','flashsocket','xhr-polling'],
    	origins:'http://*:* https://*:*'
    })

    // io.adapter(sio_redis({ host: conf.redis.host, port: conf.redis.port }))
    io.on('listening',function(socket){
		console.log("llego una peticion")
    })
    io.on('connection', function (socket) {
    	console.log("Sockets listos")
    })
}
