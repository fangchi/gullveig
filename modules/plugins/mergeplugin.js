var _ = require('underscore');
module.exports = function(req,res,args) {
	_.map(args.query,function(value,key){
		req.query[key] = value;
	});
	_.map(args.body,function(value,key){
		req.body[key] = value;
	});
	_.map(args.cookies,function(value,key){
		//默认放入query 而非body中
		if(req.cookies[key])
			req.query[value] = req.cookies[key];
	});
}