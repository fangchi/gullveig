var _ = require('underscore');
module.exports = function(req,res,args) {
	_.map(args.query,function(value,key){
		var temp = req.query[key];
		req.query[value] = temp;
		delete req.query[key]; 
	});
	
	_.map(args.body,function(value,key){
		var temp = req.body[key];
		req.body[value] = temp;
		delete req.body[key]; 	
	});

	//路由参数 ex: /user/:id 不允许变更
	/*_.map(args.route,function(value,key){
		var temp = req.params[key];
		req.params[value] = temp;
		delete req.params[key]; 	
	});*/
}