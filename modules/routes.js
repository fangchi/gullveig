var routers = require('../conf/routers'),
	_ = require('underscore'),
	S = require('string'),
	redirector = require('./redirector');

module.exports = function(app) {

	var getMethodPrex = 'get ',
	postMethodPrex = 'post ',
	putMethodPrex = 'put ',
	deleteMethodPrex = 'delete ';

	//根据路由 构建插件
	var buildHandler = function(path,plugins,methodName){
		var preplgs = checkAndLoadPlugins(plugins['pre']),
		afterplgs = checkAndLoadPlugins(plugins['after']);
		//执行
		app[methodName](path, function(req, res) {
			redirectAndExecute(preplgs,afterplgs,req,res,executePlugins);
		});
	}


	var redirectAndExecute = function(preplgs,afterplgs,req, res,executePlugins){
		//执行插件(请求前)
		if(preplgs){//如果需要
			executePlugins(preplgs,req, res);
		}
		//转发请求
		var redirectRespnse = null;
		_.map(routers.redirect,function(value,key){
    		//如果匹配 则转发
    		if(new RegExp(key,'igm').test(req.originalUrl)){
 				redirectRespnse = redirector.redirect(req,res,value,afterplgs,executePlugins);
    		} else {
    			redirectRespnse = redirector.redirect(req,res,routers.default_redirect_path
    					,afterplgs,executePlugins);
    		}
		});
	}

	//检验和加载插件
	var checkAndLoadPlugins = function(plugins){
		var res = new Array();
		_.each(plugins, function(r,idx) {
			try{
				if(_.isObject(r)){ // if has args
					_.map(r, function(args, key) {
						res[idx] = {'plugin':require('./plugins/'+key),'args':args};
					});
				} else if(_.isString(r)){ // if not have args
					res[idx] = {'plugin':require('./plugins/'+r)};
				}
			}catch(e){
				throw 'the plugin '+ r +'is can not build for reason :'+e;
			}
		});
		return res;
	}

	//按顺序执行插件
	var executePlugins = function(plugins,req,res,redirectRespnse,responseData){
		for(var idx in plugins){
			if(plugins[idx]['plugin'](req,res,plugins[idx]['args'],redirectRespnse,responseData) == false){
				return ;
			}
		}
	}

	//校验HTTP方法头
	var checkHttpMethod = function( key,methodPrex){
		return S(key.toLowerCase()).startsWith(methodPrex);
	}

	//构建路由
	_.map(routers.route_paths, function(plugins, key) {
		plugins = !plugins?routers.default_handle_seq:plugins;
		//构建转发之前的
		if(checkHttpMethod(key,getMethodPrex)){
			buildHandler(S(key).chompLeft(getMethodPrex).s,plugins,'get');
		} else if (checkHttpMethod(key,postMethodPrex)){
			buildHandler(S(key).chompLeft(postMethodPrex).s,plugins,'post');
		} else if (checkHttpMethod(key,putMethodPrex)){
			buildHandler(S(key).chompLeft(putMethodPrex).s,plugins,'put');
		} else if (checkHttpMethod(key,deleteMethodPrex)){
			buildHandler(S(key).chompLeft(deleteMethodPrex).s,plugins,'delete');
		} else {
			throw 'router build err: uri '+ key.toLowerCase()+' is not match the http method post|get|put|delete';
		}
	});

	//所有路由匹配默认
	buildHandler('*',routers.default_handle_seq,'all');
}