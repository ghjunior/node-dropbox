var sys = require('sys');
var OAuth= require('./vendor/node-oauth/lib/oauth').OAuth;

var DROPBOX_API_URI = 'http://api.getdropbox.com/';
var DROPBOX_API_SSL_URI = 'https://api.dropbox.com/';
var DROPBOX_CONTENT_API_URI = 'https://api-content.dropbox.com/';
var DROPBOX_API_VERSION = '0';
var DROPBOX_CONSUMER_KEY = '';
var DROPBOX_CONSUMER_SECRET = '';

var oa = new OAuth(DROPBOX_API_URI + DROPBOX_API_VERSION + '/oauth/request_token',
                  DROPBOX_API_URI + DROPBOX_API_VERSION + '/oauth/access_token',
                  DROPBOX_CONSUMER_KEY,
                  DROPBOX_CONSUMER_SECRET,
                  '1.0',
                  null,
                  'HMAC-SHA1');

exports.getRequestToken = function(callback) {
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
		var data = {authorizeURI: DROPBOX_API_URI + DROPBOX_API_VERSION + '/oauth/authorize', requestToken: oauth_token, requestTokenSecret: oauth_token_secret};		
		var res = (error != undefined)? error.split(' : ')[1] : JSON.stringify(data);
		callback(res);
	})
}

exports.getAccessToken = function(token, tokenSecret, callback) {
	oa.getOauthAccessToken(token, tokenSecret, function(error, oauth_access_token, oauth_access_token_secret, results) {
		var data = {accessToken: oauth_access_token, accessTokenSecret: oauth_access_token_secret};		
		var res = (error != undefined)? error.split(' : ')[1] : JSON.stringify(data);
		callback(res);
	});
}

exports.getAccountInfo = function (token, tokenSecret, callback) {
	oa.getProtectedResource(DROPBOX_API_SSL_URI + DROPBOX_API_VERSION + '/account/info', 'GET', token, tokenSecret,  function (error, data, response) {
		var res = (error != undefined)? error.split(' : ')[1] : data;	
		callback(res);
	});
}

exports.getFiles = function(token, tokenSecret, path, callback) {
	path = (path != undefined)? path : '';	
	oa.getProtectedResource(DROPBOX_CONTENT_API_URI + DROPBOX_API_VERSION + '/files/dropbox/' + path, 'GET', token, tokenSecret,  function (error, data, response) {
		var res = (error != undefined)? error.split(' : ')[1] : data;	
		callback(res);
	});
}

exports.getMetadata = function(token, tokenSecret, path, callback) {
	path = (path != undefined)? path : '';	
	oa.getProtectedResource(DROPBOX_API_URI + DROPBOX_API_VERSION + '/metadata/dropbox/' + path, 'GET', token, tokenSecret,  function (error, data, response) {
		var res = (error != undefined)? error.split(' : ')[1] : data;	
		callback(res);
	});
}
