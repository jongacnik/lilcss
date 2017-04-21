var fs = require('fs')
var path = require('path')
var glob = require('glob-all')
var x = require('xtend')

var { matchesArr, flatten, uniq } = require('./helpers')

module.exports = function (css, src, opts) {
  if (!css || !src) return

  opts = x({
    ignore: [],
    attr: ['class', 'sm', 'md', 'lg', 'xl']
  }, opts)

  var root = process.cwd()

  var css = fs.existsSync(path.join(root, css))
    ? fs.readFileSync(path.join(root, css), 'utf8')
    : String(css)

  var files = glob.sync(src).map(s => {
    return fs.readFileSync(path.join(root, s), 'utf8')
  })

  function extractSelectors (files) {
    var selectorArr = files.map(file => {
      // remove new lines to simplify parsing
      var minimized = file.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s{2,}/gm, ' ')

      // find all attribute-like strings: class="..." or class='...'
      var re1 = new RegExp(`(${opts.attr.join('|')})="([^]+?)"`, 'ig')
      var re2 = new RegExp(`(${opts.attr.join('|')})='([^]+?)'`, 'ig')
      var matches1 = matchesArr(minimized, re1)
      var matches2 = matchesArr(minimized, re2)
      var matches = matches1.concat(matches2)

      // new matching patterns could be added here
      // and the matches arrays would be concat

      return getSelectors(matches)
    }).reduce(flatten, [])

    return uniq(selectorArr)
  }

  function getSelectors (matches) {
    return matches.map(match => {
      // match[0] selector
      // match[1] values
      if (match) {
        var attr = match[0] === 'class' ? false : match[0]
        var vals = getValues(match[1])
        return vals.map(val => makeSelector(val, attr))
      }
    }).reduce(flatten, [])
  }

  function getValues (string) {
    return string
      .replace(/[^a-zA-Z0-9\-\s]/ig, '')
      .split(' ')
      .filter(v => v)
  }

  function makeSelector (prefix, attr) {
    return attr
      ? '[' + attr + '~="' + prefix + '"]'
      : '.' + prefix
  }

  // tries to put every declaration on single line
  // returns Array of lines of css for filtering
  function minimizeCss (css) {
    return css
      .split('\n')
      .map(line => line.trim().replace(/\s+\{/, '{'))
      .reduce((a, b) => {
        var copy = a.slice(0)
        var last = copy.pop()
        if (!last) {
          copy.push(b)
        } else if (/{.+}/.test(last) || last.indexOf('@') >= 0 || last === '}') {
          copy.push(last)
          copy.push(b)
        } else {
          copy.push(last + b)
        }
        return copy
      }, [])
  }

  function cleanCss (css) {
    var minimized = minimizeCss(css)
    return minimized.filter(line => {
      // skip if not class or attribute selector ¯\_(ツ)_/¯
      if (!/^[\.\[]/i.test(line)) {
        return true
      } else {
        return selectors.some(sel => {
          return line.indexOf(sel + '{') >= 0
        })
      }
    }).join('\n')
  }

  var selectors = extractSelectors(files).concat(opts.ignore)
  var cleaned = cleanCss(css)

  return cleaned
}
