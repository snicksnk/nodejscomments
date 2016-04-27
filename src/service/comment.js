"use strict";

var MongooseService = require('./mongooseService.js');
var Comment = require('../model/comment.js');



class CommentService extends MongooseService {
	constructor(){
		super(Comment);
	}


	_calculateParentPath(pid){

		return new Promise((resolve, reject) => {
		
			if (!pid){
				resolve([]);
				return;
			}

			
			this.findOne({
	            '_id': pid
	        })
	        .then(parentComment => {

	        	if (parentComment){

	        		var newPath = parentComment.path;

	        		newPath.push(parentComment._id.toString());
	        		resolve(newPath);
	        	} else {
	        		reject(new Error('No parent comment'));
	        	}

	        }).catch(reject)

		});


	}


	getMaxDepth(){
		return new Promise((resolve, reject) => {
			Comment.aggregate(
		    {
		        $project: {
		            dep: {$size: "$path"}
		        }
		    }, 
		    {
		        $sort: {dep: -1}
		    }, 
		    {
		        $limit: 1
		    }, function (err, result) {
		        if (err) {
		            reject(err);
		        } else {
		            resolve({max_depth: result[0].dep});
		        }
		    });

		});
	}

	getNested(){
		return new Promise((resolve, reject) => {
			Comment
		        .find()
		        .sort({'path': -1, date: 1})
		        .populate('_author')
		        .exec(function (err, comments){
		            if (err){
		                reject(err);
		            }

		            var childrens = {};
		            var data = [];

		            for (let c in comments){
		                var element = comments[c];
		                var parentId = element.path[element.path.length - 1];
		                var elementId = element._id;

		                var comment = {
		                    _id:      element._id,
		                    text:    element.text,
		                    _author: element._author.toJson(),
		                    path:    element.path,
		                    date:     element.date,
		                    childrens: []
		                };

		                if (typeof childrens[parentId] === 'undefined'){
		                    childrens[parentId] = [];            
		                }

		                if (typeof childrens[elementId] !== 'undefined'){     
		                    comment['childrens'] = childrens[elementId];
		                }

		                if (!parentId){
		                    data.push(comment);
		                } else {
		                    childrens[parentId].push(comment);
		                }                

		            }


		            resolve(data);
		        });
		});
	}

		

	create(data){
		var text = data.text;
		var pid = data.pid;
		var authorId = data.authorId;


		return new Promise((resolve, reject) => {

			var _create = super.create;



			this._calculateParentPath(pid)
			.then(newPath => {
                

                _create.call(this, 
                {
                	text: text,
                    path: newPath,
                    _author: authorId
                }).then(resolve)
                .catch(reject);

			  	

			})
			.catch(reject);

		});
	}

}


module.exports = new CommentService();