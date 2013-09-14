var _ = require('underscore');
module.exports = function(req,res,args,response,respnseData) {
	res.json(respnseData, response.statusCode);
}