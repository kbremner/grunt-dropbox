# grunt-dropbox

> Grunt plugin for uploading build artifacts to dropbox

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-dropbox --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-dropbox');
```

## The "dropbox" task

### Files
When specifying files, the destination must be specified (i.e. specifying the source file only is not supported). The destination is the path from the root of your dropbox directory to upload the local files to.

### Options

#### options.version_name
Type: `String`
Required: `False`

An optional string value that is appended to the destination path to differentiate artifacts from different builds. If using Travis CI, it is recommended that this be set to `process.env.TRAVIS_BUILD_NUMBER`.

#### options.access_token
Type: `String`
Required: `True`

A string value that is used to authenticate with Dropbox. Note that as this task is meant to be unattended, it is assummed that an access token has already been obtained. See [this wiki page](https://github.com/kbremner/grunt-dropbox/wiki/Creating-a-Dropbox-Access-Token) for more details.

### Usage Examples

Define a `dev` task that will upload the `dist` directory to `uploads/sample-project/` in the dropbox account associated with the provided token:
```js
grunt.initConfig({
  dropbox: {
    options: {
      access_token: '<token>'
    },
    dev: {
      files: {
        'uploads/sample-project': ['dist/**/*.*'],
      }
    }
  },
});
```

Define a `dev` task that will upload the files in the root of the `dist` directory to a folder under `uploads/sample-project/` named after the current travis build number (i.e. for build number 32, the files will be uploaded to `uploads/sample-project/32/`). The files are uploaded to the dropbox account associated with the access token provided via the dropbox\_access\_token environment variable:
```js
grunt.initConfig({
  dropbox: {
    options: {
      access_token: process.env.dropbox_access_token,
      version_name: process.env.TRAVIS_BUILD_NUMBER
    },
    dev: {
      files: {
        'uploads/sample-project': ['dist/*.*'],
      }
    }
  },
});
```

## Contributing
Please feel free to raise issues and submit pull requests. I'll try and reply to issues as quickly as possible.

## Release History
* 0.1.1
  * moved to using promises, other code cleanup
* 0.1.0
  * initial release

