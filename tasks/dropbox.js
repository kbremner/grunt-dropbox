/*
 * grunt-dropbox
 * https://github.com/kbremner/grunt-dropbox
 *
 * Copyright (c) 2014 Kyle Bremner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	var dropbox = require('../lib/dropbox');
  var dropboxClient = new dropbox();
  
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  grunt.registerMultiTask('dropbox', 'Grunt plugin to sync build artifacts to dropbox', function() {
    var task = this;
    var done = this.async();
    var count = 0;
    
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      access_token: process.env.dropbox_access_token
    });
    
    verifyOptions(options);
    
    dropboxClient.getAccountInfo(options, function(err, resp) {
      if(err) {
        done();
        throw err;
      }

      grunt.log.writeln("Uploading to dropbox account for " + resp.display_name + "...");
      
      task.files.forEach(function(f) {
        f.src.filter(isFile).map(function(filepath) {
          // mark that an upload has started by incrementing an in-flight count
          count += 1;
          
          // get the name of the file and construct the url for uploading it
          var filename = getFilename(filepath);
          var dropboxPath = f.dest + "/" + options.version_name + "/" + filepath;
              
          grunt.log.writeln("Uploading " + filepath + " to " + dropboxPath + "...");
          
          // read the file and start the upload, decrementing the in-flight count when complete
          // Use encoding = null to keep the file as a Buffer
          var reqOptions = {
            access_token: options.access_token,
            dropboxPath: dropboxPath,
            fileBuffer: grunt.file.read(filepath, { encoding : null })
          }
          
          dropboxClient.upload(reqOptions, function(err, resp) {
            if(err) {
              done();
              throw err;
            }
            grunt.log.writeln(filename + " uploaded.");
            count -= 1;
          });
        });
      });
      
      // wait for all uploads are complete before marking the task as done
      var timeout = 1000;
      function waitForUpload() {
        if(count === 0) {
          grunt.log.writeln("All uploads complete.");
          done();
        } else {
        	setTimeout(waitForUpload, timeout);  
        }
      }
      
      setTimeout(waitForUpload, timeout);
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
    var optionNames = ['version_name', 'access_token'];
    optionNames.forEach(function(option) {
      if(!options[option]) {
        grunt.fail.fatal(option + ' option must be specified');
      }
    });
  }
};
