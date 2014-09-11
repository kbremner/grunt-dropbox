/*
 * grunt-dropbox
 * https://github.com/kbremner/grunt-dropbox
 *
 * Copyright (c) 2014 Kyle Bremner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var Dropbox = require('../lib/dropbox');
  var dropboxClient = new Dropbox();
  
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  grunt.registerMultiTask('dropbox', 'Grunt plugin to sync build artifacts to dropbox', function() {
    var task = this;
    var done = this.async();
    
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options();
    
    verifyOptions(options);
    
    // get the name of the account holder for debugging
    var promise = dropboxClient.getAccountInfo(options).then(function(resp) {
      grunt.log.writeln("Uploading to dropbox account for " + resp.display_name + "...");
    });
    
    // loop through all the file objects
    task.files.forEach(function(f) {
      // ensure that a destination has been specified
      if(!f.dest) {
        grunt.fail.fatal("a destination must be specified for all files"); 
      }
      
      // loop through all the src files, uploading them
      f.src.filter(isFile).map(function(filepath) {
        // set the root promise to a continuation
        promise = promise.then(function() {
          // get the name of the file and construct the url for uploading it
          var filename = getFilename(filepath);
          var dropboxPath = f.dest + (options.version_name ? ("/" + options.version_name + "/") : "/") + filepath;

          grunt.log.writeln("Uploading " + filepath + " to " + dropboxPath + "...");

          // read the file and start the upload, decrementing the in-flight count when complete
          // Use encoding = null to keep the file as a Buffer
          var reqOptions = {
            access_token: options.access_token,
            dropboxPath: dropboxPath,
            fileBuffer: grunt.file.read(filepath, { encoding : null })
          };

          // return the upload promise
          return dropboxClient.upload(reqOptions);
        });
      });
    });
    
    // well all the continuations are done, finish this async task
    promise.then(function() {
      done();
    });
  });
  
  function getFilename(filepath) {
    var splitPath = filepath.split("/");
    return splitPath[splitPath.length - 1];
  }

  function isFile(filepath) {
    if (!grunt.file.exists(filepath)) {
      grunt.log.warn('Source file "' + filepath + '" not found.');
      return false;
    } else if(grunt.file.isDir(filepath)) {
      grunt.log.warn('"' + filepath + '" is a directory. Please ensure that the file pattern does not include directories.');
      return false;
    }
    return true;
  }
  
  function verifyOptions(options) {
    ['access_token'].forEach(function(option) {
      if(!options[option]) {
        grunt.fail.fatal(option + ' option must be specified');
      }
    });
  }
};
