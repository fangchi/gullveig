var express = require('express'),
	http = require('http'),
	path = require('path'),
	routes = require('../modules/routes'),
	settings = require('../conf/settings');


var app = express();

// all environments
app.set('port', settings.port || 3000); //设置端口为 process.env.PORT 或 3000
app.use(express.logger('dev')); //connect 内建的中间件，在开发环境下使用，在终端显示简单的不同颜色的日志
app.use(express.bodyParser()); //connect 内建的中间件，用来解析请求体，支持 application/json， application/x-www-form-urlencoded, 和 multipart/form-data
app.use(express.methodOverride()); //connect 内建的中间件，可以协助处理 POST 请求，伪装 PUT、DELETE 和其他 HTTP 方法
app.use(express.cookieParser());
app.use(express.session({
	secret: settings.cookieSecret,
	cookie: {
		maxAge: settings.cookieAge||1000 * 60 * 60 * 24 * 30
	}
}));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}
http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

routes(app);