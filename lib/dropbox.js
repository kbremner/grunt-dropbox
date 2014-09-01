/*
 * grunt-dropbox
 * https://github.com/kbremner/grunt-dropbox
 *
 * Copyright (c) 2014 Kyle Bremner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function() {
  var Promise = require('bluebird');
	var request = Promise.promisify(require('request'));
  var accountInfoUrl = "https://api.dropbox.com/1/account/info";
  var uploadUrl = "https://api-content.dropbox.com/1/files_put/auto/";

  this.getAccountInfo = function(options) {
    var reqOptions = {
      method: "GET",
      url: accountInfoUrl,
      auth: {
        bearer: options.access_token
      }
    };
    
    return request(reqOptions).then(parseBody);
  }
  
  this.upload = function(options) {
    var reqOptions = {
      method: "PUT",
      body: options.fileBuffer,
      url: uploadUrl + options.dropboxPath,
      auth: {
        bearer: options.access_token
      }
    };
    
    return request(reqOptions).then(parseBody);
  }
  
  function parseBody(resp) {
    return JSON.parse(resp[1]);
  }
}