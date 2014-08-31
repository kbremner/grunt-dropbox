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

### Overview
In your project's Gruntfile, add a section named `dropbox` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  dropbox: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.version_name
Type: `String`
Default value: none

A string value that is used as the name of the folder to upload the build artifacts to, inside the project directory. It is up to the developer to ensure that this is unique. If using Travis CI, it is recommended that this be set to `process.env.TRAVIS_BUILD_ID`.

#### options.access_token
Type: `String`
Default value: `process.env.dropbox_access_token`

A string value that is used to authenticate with Dropbox. Note that as this task is meant to be unattended, it is assummed that an access token has already been obtained. See the wiki for more details.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  dropbox: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  dropbox: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
