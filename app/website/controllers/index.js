class Home {
	constructor(conf){
		this.conf = conf || {};
		this.response = function(){
			this[this.conf.funcionalidad](this.conf.req,this.conf.res,this.conf.next);
		}
	}

	get_index(req,res,next){
		res.status(200).json({
			"status":"ok"
		})
	}
	get_login(req,res,nex){
		res.status(200).json({
			"status":"Yeah!"
		})
	}
}

module.exports = Home
