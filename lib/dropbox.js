/*
 * grunt-dropbox
 * https://github.com/kbremner/grunt-dropbox
 *
 * Copyright (c) 2014 Kyle Bremner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function() {
  var accountInfoUrl = "https://api.dropbox.com/1/account/info";
  var uploadUrl = "https://api-content.dropbox.com/1/files_put/auto/";
	var request = require('request');

  this.getAccountInfo = function(options, callback) {
    var reqOptions = {
      method: "GET",
      url: accountInfoUrl,
      auth: {
        bearer: options.access_token
      }
    };
    
    req(reqOptions, callback);
  }
  
  this.upload = function(options, callback) {
    var reqOptions = {
      method: "PUT",
      body: options.fileBuffer,
      url: uploadUrl + options.dropboxPath,
      auth: {
        bearer: options.access_token
      }
    };
    
    req(reqOptions, callback);
  }
  
  function req(options, callback) {
    var context = this;
    request(options, function(error, response, body) {
      if(error) {
        callback.call(context, error);
      } else {
        callback.call(context, error, JSON.parse(body));
      }
    });
  }
}