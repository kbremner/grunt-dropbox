/*
 * grunt-dropbox
 * https://github.com/kbremner/grunt-dropbox
 *
 * Copyright (c) 2014 Kyle Bremner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	var request = require('request');
  var pkg = require('package.json');
  
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  grunt.registerMultiTask('dropbox', 'Grunt plugin to sync build artifacts to dropbox', function() {
    var task = this;
    var done = this.async();
    var count = 0;
    
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      project_name: pkg.name,
      access_token: process.env.access_token
    });
    
    verifyOptions(options);
    
    get.call(this, options, "https://api.dropbox.com/1/account/info", function(resp) {
      grunt.log.writeln("Uploading to dropbox account for " + resp.display_name + " for project " + options.project_name + "...");
      
      this.files.forEach(function(f) {
        f.src.filter(filterExists).map(function(filepath) {
          // mark that an upload has started by incrementing an in-flight count
          count += 1;
          
          // get the name of the file and construct the url for uploading it
          var splitPath = filepath.split("/");
          var filename = splitPath[splitPath.length - 1];
          var dropboxPath = f.dest + "/" + options.project_name + "/" + options.version_name + "/" + filename;
          var url = "https://api-content.dropbox.com/1/files_put/auto/" + dropboxPath;
              
          grunt.log.writeln("uploading " + filepath + " to " + dropboxPath + "...");
          
          // read the file and start the upload, decrementing the in-flight count when complete
          // Use encoding = null to keep the file as a Buffer
          var fileBuffer = grunt.file.read(filepath, { encoding : null });
          put.call(task, options, url, fileBuffer, function(resp) {
            grunt.log.writeln(filename + " finished");
            count -= 1;
          });
        });
      });
      
      // wait for all uploads are complete before marking the task as done
      var timeout = 1000;
      function waitForUpload() {
        if(count === 0) {
          grunt.log.writeln("all uploads complete");
          done();
        } else {
        	setTimeout(waitForUpload, timeout);  
        }
      }
      
      setTimeout(waitForUpload, timeout);
    });
  });
  
  

  function filterExists(filepath) {
    if (!grunt.file.exists(filepath)) {
      grunt.log.warn('Source file "' + filepath + '" not found.');
      return false;
    } else {
      return true;
    }
  }
  
  function verifyOptions(options) {
    var optionNames = ['version_name', 'project_name', 'access_token'];
    optionNames.forEach(function(option) {
      if(!options[option]) {
        grunt.fail.fatal(option + ' option must be specified');
      }
    });
  }
  
  function get(options, url, callback) {
    var reqOptions = {
      method: "GET",
      url: url,
      auth: {
        bearer: options.access_token
      }
    };
    
    req.call(this, reqOptions, callback);
  }
  
  function put(options, url, body, callback) {
    var reqOptions = {
      method: "PUT",
      body: body,
      url: url,
      auth: {
        bearer: options.access_token
      }
    };
    
    req.call(this, reqOptions, callback);
  }
  
  function req(reqOptions, callback) {
    var task = this;
    request(reqOptions, function(error, response, body) {
      if(error) {
        grunt.fail.fatal("error sending request: " + error);
      } else {
        callback.call(task, JSON.parse(body));
      }
    });
  }
};
