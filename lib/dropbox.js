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
    accountInfoUrl = "https://api.dropbox.com/1/account/info",
    uploadUrl = "https://api-content.dropbox.com/1/files_put/auto/";

  function parseBody(resp) {
    return JSON.parse(resp[1]);
  }
  
  this.getAccountInfo = function (options) {
    var reqOptions = {
      method: "GET",
      url: accountInfoUrl,
      auth: {
        bearer: options.access_token
      }
    };
    
    return request(reqOptions).then(parseBody);
  };
  
  this.upload = function (options) {
    var reqOptions = {
      method: "PUT",
      body: options.fileBuffer,
      url: uploadUrl + options.dropboxPath,
      auth: {
        bearer: options.access_token
      }
    };
    
    return request(reqOptions).then(parseBody);
  };
};