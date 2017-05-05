var env = process.env.NODE_ENV || 'production',
express = require('express'),
bodyParser = require('body-parser'),
path = require('path')
    // middlewares = require('./middlewares/admin'),
    router = require('./router');


    var ExpressServer = function(config) {
    	config = config || {};
    	this.expressServer = express();
    // middlewares
    this.expressServer.use(function(req, res, next) {
    	res.header("Access-Control-Allow-Origin", "*");
    	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    	next();
    })
    /*this.expressServer.use(bodyParser.urlencoded({extended: true}))
    this.expressServer.use(bodyParser.json())*/
    // for (var middleware in middlewares){
    //     this.expressServer.use(middlewares[middleware]);
    // }

    this.expressServer.use(express.static(__dirname + '/public'));
    this.expressServer.get("/chat",function(re,res,next){
    	res.sendFile(path.join(__dirname + '/chat.html'))
    })
    this.expressServer.get("/ulti",function(re,res,next){
    	res.sendFile(path.join(__dirname + '/ulti.html'))
    })

    /*if(env == 'development'){
        console.log('OK NO HAY CACHE');
    }*/

    for (var controller in router){
    	var functions = Object.getOwnPropertyNames(router[controller].prototype)
        for (var index in functions){
		    let funcionalidad = functions[index]
        	if(funcionalidad.localeCompare('constructor')!=0){
		        var method = funcionalidad.split('_')[0];
		        var entorno = funcionalidad.split('_')[1];
		        var data = funcionalidad.split('_')[2];
		        data = (method == 'get' && data !== undefined) ? ':data' : '';
		        var url = ''
		        if(controller=='home'){
		        	if(entorno=='index'){
		        		url="/"+data
		        	}else{
		        		url = '/' + entorno + '/' + data;
		        	}
		        }else{
		        	if(entorno=='index'){
		        		url = '/' + controller  + '/' + data;
		        	}else{
		        		url = '/' + controller + '/' + entorno + '/' + data;
		        	}
		        }
		        this.router(controller,funcionalidad,method,url);
        	}
        }
    }
};
ExpressServer.prototype.router = function(controller,funcionalidad,method,url){
	console.log(method+" | "+url);
	this.expressServer[method](url, function(req,res,next){
		var conf = {
			'funcionalidad':funcionalidad,
			'req': req,
			'res': res,
			'next': next
		}
		var Controller = new router[controller](conf);
		Controller.response();
	});
}
module.exports = ExpressServer;
