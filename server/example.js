var http = require('http');
var sys = require('sys');
var url = require('url');
var dropbox = require('./lib/dropbox');

http.createServer(function (req, res) {
	var pathname = url.parse(req.url).pathname;
	var pathnameArr = pathname.split('/');

	if (pathnameArr[1] == 'dropbox') {
		var service = pathnameArr[2];
		var query = url.parse(req.url, true).query;
		var callback = (query && query.callback)? query.callback : 'callback';

		res.writeHead(200, {'Content-Type': 'application/json'});		

		switch (service) {
			case 'requestToken':
				dropbox.getRequestToken(function(jsonRes) {
					res.end(callback + '(' + JSON.stringify(jsonRes) + ')');
				});
				break;
			case 'accessToken':
				dropbox.getAccessToken(pathnameArr[3], pathnameArr[4], function(jsonRes) {
					res.end(callback + '(' + JSON.stringify(jsonRes) + ')');
				});
				break;
			case 'accountInfo':
				dropbox.getAccountInfo(pathnameArr[3], pathnameArr[4], function(jsonRes) {
					res.end(callback + '(' + JSON.stringify(jsonRes) + ')');
				});
				break;
			case 'files':
				var path = (pathnameArr[5] != undefined)? pathnameArr[5] : '';			
				dropbox.getFiles(pathnameArr[3], pathnameArr[4], path, function(jsonRes) {
					res.end(callback + '(' + JSON.stringify(jsonRes) + ')');
				});
				break;
			case 'metadata':
				var path = (pathnameArr[5] != undefined)? pathnameArr[5] : '';						
				dropbox.getMetadata(pathnameArr[3], pathnameArr[4], path, function(jsonRes) {
					res.end(callback + '(' + JSON.stringify(jsonRes) + ')');
				});
				break;
			default:
				var jsonRes = {status: 'error', reason: 'Service not found.'};				
				res.end(callback + '(' + JSON.stringify(jsonRes) + ')');
				break;
		}	
	}
}).listen(8124);
