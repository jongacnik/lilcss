#!/usr/bin/env node

var lilcss = require('../src')
var getStdin = require('get-stdin')
var yargs = require('yargs')

var argv = yargs
  .usage('Usage: $0 style.css -f [files..]')
  .options({
    'f': {
      alias: 'files',
      demand: true,
      describe: 'source files to parse',
      type: 'array'
    },
    'a': {
      alias: 'attr',
      demand: false,
      describe: 'attributes to parse',
      type: 'array'
    },
    'i': {
      alias: 'ignore',
      demand: false,
      describe: 'selectors to ignore',
      type: 'array'
    }
  })
  .help()
  .argv

getStdin().then(str => {
  var input = str || argv._.slice(0).pop()
  var files = argv.f || argv.files
  var attr = argv.a || argv.attr
  var ignore = argv.i || argv.ignore

  if (!input || !files) {
    yargs.showHelp()
    return
  }

  var opts = {}
  if (attr) opts['attr'] = attr
  if (ignore) opts['ignore'] = ignore

  var output = lilcss(input, files, opts)

  process.stdout.write(output)
})
