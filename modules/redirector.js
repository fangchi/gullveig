var routers = require('../conf/routers'),
	_ = require('underscore'),
	http = require('http'),
	https = require('https'),
	S = require('string'),
	querystring = require('querystring');

//转发并执行后置插件
exports.redirect = function(req, res, newUrl, plugins, pluginCallback) {
	var result = null;
	var args = getArgs(newUrl);
	//重新构建http参数
	var post_data = querystring.stringify(req.body);
	var options = {
		host: args[1].replace('//', ''),
		port: 8998,
		path: req.query ? req._parsedUrl.pathname + "?" + querystring.stringify(req.query) : req._parsedUrl.pathname,
		method: req.method,
		headers: req.headers
	};
	options.headers['content-length'] = post_data.length;

	//回调函数
	var dataCallback = function(response) {
		response.setEncoding('utf8');
		response.on('data', function(chunk) {
			if (plugins) { // 如果后续处理插件
				var args = [plugins, req, res, response, chunk];
				pluginCallback.apply(null, args);
			} else {
				res.json(chunk, response.statusCode);
			}
		});
	};
	var request = null;
	//按照协议构建请求
	if (args[0] == 'http') {
		request = http.request(options, dataCallback);
	} else if (args[0] == 'https') {
		request = https.request(options, dataCallback);
	} else {
		throw 'can not redirect request for unknown prococal ' + args[0];
	}

	request.on('error', function(e) {
		res.json('server is error for the reason :' + e.toString(), 500);
	});
	request.write(post_data); //Write body data 
}

//获取URL参数

function getArgs(queryurl) {
	var results = queryurl.split(":");
	if (results.length != 3) {
		results[2] = 80;
	}
	return results;
}