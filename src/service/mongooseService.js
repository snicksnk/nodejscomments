"use strict";

class MongooseService {

	constructor(Shema){
		this.Shema = Shema;
	}

	find(){
		return new Promise((resolve, reject) => {
			this.Shema.find({}, function(err, result){
	        	if(err){
	        		reject(err);
	        	} else {
	        		resolve(result);
	        	}   		
	        });
    	});
	}

	findOne(condition){
		return new Promise((resolve, reject) => {
			this.Shema.findOne(condition, function(err, result){
	        	if(err){
	        		reject(err);
	        	} else {
	        		resolve(result);
	        	}   		
	        });
    	});
	}

	create(data){
		return new Promise((resolve, reject) => {
			var entity = new this.Shema(data);

		  	entity.save(function(err){
		  		if(err){
	        		reject(err);
	        	} else {
	        		resolve(entity);
	        	} 
		  	});
	  	});
	}


}

module.exports = MongooseService;