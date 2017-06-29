/*
 * grunt-dropbox
 * https://github.com/kbremner/grunt-dropbox
 *
 * Copyright (c) 2014 Kyle Bremner
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  'use strict';
  var Dropbox = require('../lib/dropbox'),
    dropboxClient = new Dropbox();

  function getFilename(filepath) {
    var splitPath = filepath.split("/");
    return splitPath[splitPath.length - 1];
  }

  function isFile(filepath) {
    if (!grunt.file.exists(filepath)) {
      grunt.log.warn('Source file "' + filepath + '" not found.');
      return false;
    } else if (grunt.file.isDir(filepath)) {
      grunt.log.warn('"' + filepath + '" is a directory. Please ensure that the file pattern does not include directories.');
      return false;
    }
    return true;
  }

  function hasDestination(file) {
    if(file.dest === undefined) {
      grunt.fail.fatal("a destination must be specified for all files");
    }
    return true;
  }

  function verifyOptions(options) {
    ['access_token'].forEach(function (option) {
      if (!options[option]) {
        grunt.fail.fatal(option + ' option must be specified');
      }
    });
  }

  // returns a function that creates a promise to upload the file to the destination
  function createUploadPromise(filepath, destination, options) {
    return function () {
      // get the name of the file and construct the url for uploading it
      var filename = getFilename(filepath),
        dropboxPath = destination + (options.version_name ? ("/" + options.version_name + "/") : "/") + filepath,
        // read the file and start the upload, decrementing the in-flight count when complete
        // Use encoding = null to keep the file as a Buffer
        reqOptions = {
          access_token: options.access_token,
          dropboxPath: dropboxPath,
          fileBuffer: grunt.file.read(filepath, { encoding : null })
        };

      grunt.log.writeln("Uploading " + filepath + " to " + dropboxPath + "...");

      // return the upload promise
      return dropboxClient.upload(reqOptions);
    };
  }

  // create the task
  grunt.registerMultiTask('dropbox', 'Grunt plugin to sync build artifacts to dropbox', function () {
    var task = this,
      promise,
      done = this.async(),
      options = this.options({ verbose: false });

    verifyOptions(options);

    // get the name of the account holder for debugging
    if(options.verbose === true) {
      promise = dropboxClient.getAccountInfo(options).then(function (resp) {
        grunt.log.writeln("Uploading to dropbox account for " + resp.name.display_name + "...");
      });
    }

    // loop through all the file objects
    task.files.filter(hasDestination).forEach(function (f) {
      // loop through all the src files, uploading them
      f.src.filter(isFile).map(function (filepath) {
        // create the function that creates the upload promise
        var uploadPromise = createUploadPromise(filepath, f.dest, options);
        if(promise === undefined) {
          // start the promise
          promise = uploadPromise();
        } else {
          // set the promise to start when the current one finishes
          promise = promise.then(uploadPromise);
        }
      });
    });

    // well all the continuations are done, finish this async task
    promise.then(function () {
      done();
    });
  });
};
