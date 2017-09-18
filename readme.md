<h1 align="center">lilcss ⚗</h1>

<div align="center">
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square" alt="Stability" />
  </a>
  <a href="https://www.npmjs.com/package/lilcss">
    <img src="https://img.shields.io/npm/v/lilcss.svg?style=flat-square" alt="NPM version" />
  </a>
</div>

<br>

Distill out css bloat by parsing static files for selectors

## Example

Let's run `lilcss` via the command line, passing in our css file containing a bunch of unused styles, and all of our site templates. We'll pipe the results to a new file.

```
$ lilcss fat.css -f templates/*.js > lil.css
```

<details>
  <summary>fat.css</summary>

  ```css
  .c1{width:8.333333333333332%}
  .c2{width:16.666666666666664%}
  .c3{width:25%}
  .c4{width:33.33333333333333%}
  .c5{width:41.66666666666667%}
  .c6{width:50%}
  .c7{width:58.333333333333336%}
  .c8{width:66.66666666666666%}
  .c9{width:75%}
  .c10{width:83.33333333333334%}
  .c11{width:91.66666666666666%}
  .c12{width:100%}
  .df{display:flex}
  .db{display:block}
  .dib{display:inline-block}
  .di{display:inline}
  .dt{display:table}
  .dtc{display:table-cell}
  .dtr{display:table-row}
  .dn{display:none}
  ```

</details>

<details>
  <summary>templates</summary>

  ```js
  module.exports = html`
    <div class="c2 ${show ? 'db' : 'dn'}"></div>
  `
  ```

  ```js
  module.exports = html`
    <div class="c4 dib"></div>
    <div class="c8 dib"></div>
  `
  ```

</details>

Our new file will now only contain the css we need:

```css
.c2{width:16.666666666666664%}
.c4{width:33.33333333333333%}
.c8{width:66.66666666666666%}
.db{display:block}
.dib{display:inline-block}
.dn{display:none}
```

## API

#### `lilcss(css, src, options)`

Returns the distilled css.

| option | default | controls |
| --- | --- | --- |
| ignore | `[]` | any selectors to ignore |
| attr | `['class', 'sm', 'md', 'lg', 'xl']` | attributes to parse from files |

## Notes

`lilcss` aims to solve similar problems as [uncss](https://github.com/giakki/uncss) and [purifycss](https://github.com/purifycss/purifycss) but is a *much* less general solution. To minimize complexity, it is assumed:

1. A single css file will be parsed
2. The css file must not be minified prior to being parsed
3. General selectors, such as `body` or `input` will always be preserved
4. Any attribute selector will be treated as `~=`
5. Only class and attribute selectors are supported
6. Only HTML-like attributes will be parsed, things like `classList.add()` are not supported:

Input template to parse:
```html
<div class="c1 dn" sm="c2">
```

Extracted selectors:
```js
['.c1', '.dn', '[sm~="c2"]']
```

Anything which does not match these selectors will be removed from the css.

## Why?

Removing unused css output is important but the existing tools don't work well for my needs. [uncss](https://github.com/giakki/uncss) requires code to be run in a headless browser but this assumes too much about *how* you are building your site. [purifycss](https://github.com/purifycss/purifycss) does a bit better in that it parses static files, but the results are generally unpredictable and attribute selectors are fully unsupported.

`lilcss` has specific requirements but this allows the code to stay small and concise. More functionality may be introduced as needed.

## See Also

- [gr8](https://github.com/jongacnik/gr8)
- [gr8-util](https://github.com/jongacnik/gr8-util)
- [quick-styles](https://github.com/jongacnik/quick-styles)

## Todo

- [ ] Tests
- [ ] Better regex (or perhaps ditch and ast this thing)
