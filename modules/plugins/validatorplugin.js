var expressValidator = require('express-validator'),
	_ = require('underscore');

module.exports = function(req, res , args) {
	var errors = req.validationErrors(true);
	if (errors) {
		res.send(errors, 400);
		return false;
	}

	//validate user in cookie 
	if (!req.cookies.user) {
		res.json({
			param: 'user',
			msg: 'your user ticket is lost , please login again '
		}, 401);
		return false;
	}
	return true;
}