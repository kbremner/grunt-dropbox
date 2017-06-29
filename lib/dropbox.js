/*
 * grunt-dropbox
 * https://github.com/kbremner/grunt-dropbox
 *
 * Copyright (c) 2014 Kyle Bremner
 * Licensed under the MIT license.
 */

module.exports = function () {
	'use strict';
	var Promise = require('bluebird'),
		request = Promise.promisify(require('request')),
		accountInfoUrl = "https://api.dropboxapi.com/2/users/get_current_account",
		uploadUrl = "https://content.dropboxapi.com/2/files/upload";

	function parseBody(resp) {
	  console.log(resp);
	return JSON.parse(resp[1]);
	}

	this.getAccountInfo = function (options) {
		var reqOptions = {
			method: "POST",
			url: accountInfoUrl,
			auth: {
				bearer: options.access_token
			}
		};

		return request(reqOptions).then(parseBody);
	};

	this.upload = function (options) {
		var params = {
			"path": options.dropboxPath,
			"mode": "overwrite"
		};
		var paramsJSON = this.httpHeaderSafeJson(params);
		var reqOptions = {
			method: "POST",
			headers: {
				'Content-Type' : 'application/octet-stream',
				'Dropbox-API-Arg': paramsJSON
			},
			body: options.fileBuffer,
			url: uploadUrl,

			auth: {
				bearer: options.access_token
			}
		};

		return request(reqOptions).then(parseBody);
	};

	this.httpHeaderSafeJson = function(args){
		var charsToEncode = /[\u007f-\uffff]/g;
		return JSON.stringify(args).replace(charsToEncode, function (c) {
			return '\\u' + ('000' + c.charCodeAt(0).toString(16)).slice(-4);
		});
	}
};
