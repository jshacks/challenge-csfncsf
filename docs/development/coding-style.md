# Coding Style

These are the style guidelines for coding.

You can run `npm run lint` to show any style issues detected.

## JavaScript

* Write [standard](http://npm.im/standard) JavaScript style.
* File names should be concatenated with `-` instead of `_`, e.g.
  `file-name.js` rather than `file_name.js`. This rule only applies to `.js` files.
* Use newer ES6/ES2015 syntax where appropriate
  * [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
    for requires and other constants
  * [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
    for defining variables
  * [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
    instead of `function () { }`
  * [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
    instead of string concatenation using `+`

## Naming Things

JSHacks projects use the same capitalization scheme as Node.js:

- When the module itself is a class like `BrowserWindow`, use `CamelCase`.
- When the module is a set of APIs, like `globalShortcut`, use `mixedCase`.
- When the API is a property of object, and it is complex enough to be in a
  separate chapter like `win.webContents`, use `mixedCase`.
- For other non-module APIs, use natural titles, like `<webview> Tag` or
  `Process Object`.

When creating a new API, it is preferred to use getters and setters instead of
jQuery's one-function style. For example, `.getText()` and `.setText(text)`
are preferred to `.text([text])`.
