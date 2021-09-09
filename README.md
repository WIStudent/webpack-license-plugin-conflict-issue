# webpack-license-plugin-conflict-issue

Project to reproduce the `ERROR in Conflict` error when using 
[webpack-license-plugin@4.2.0](https://www.npmjs.com/package/webpack-license-plugin).

## Issue
Webpack runs into the error 
```
ERROR in Conflict: Multiple assets emit different content to the same filename oss-licenses.json
```
when webpack-license-plugin is used together with other certain plugins. In this case these plugins are 
[html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin) and 
[mini-css-extract-plugin](https://www.npmjs.com/search?q=mini-css-extract-plugin).

## Cause

To further analyze the issue the custom webpack plugin `MyLoggingPlugin` is used. It taps into some webpack hooks and
writes the following information to the console:

```
called compilation: name: undefined, isChild: false

called childCompiler: name: HtmlWebpackCompiler, isChild: true

called compilation: name: HtmlWebpackCompiler, isChild: true
(node:3672) [DEP_WEBPACK_COMPILATION_OPTIMIZE_CHUNK_ASSETS] DeprecationWarning: optimizeChunkAssets is deprecated (use Compilation.hooks.processAssets instead and use one of Compilation.PROCESS_ASSETS_STAGE_* as stage option)
(Use `node --trace-deprecation ...` to show where the warning was created)

called optimizeChunkAssets
asset: oss-licenses.json, size: 1403
[
  {
    "name": "html-webpack-plugin",
    "version": "5.3.2",
    "author": "Jan Nicklas <j.nicklas@me.com> (https://github.com/jantimon)",
    "repository": null,
    "source": "https://registry.npmjs.org/html-webpack-plugin/-/html-webpack-plugin-5.3.2.tgz",
    "license": "MIT",
    "licenseText": "Copyright JS Foundation and other contributors\n\nPermission is hereby granted, free of charge, to any person obtaining\na copy of this software and associated documentation files (the\n'Software'), to deal in the Software without restriction, in
cluding\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to\npermit persons to whom the Software is furnished to do so, subject to\nthe following conditions:\n\nThe above copyright
notice and this permission notice shall be\nincluded in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,\nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNE
SS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.\nIN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY\nCLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,\nTORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE\nSOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n"
  }
]

called childCompiler: name: mini-css-extract-plugin X:\PRPL\webpack-license-plugin-conflict-issue\node_modules\css-loader\dist\cjs.js!X:\PRPL\webpack-license-plugin-conflict-issue\src\style.css, isChild: true

called compilation: name: mini-css-extract-plugin X:\PRPL\webpack-license-plugin-conflict-issue\node_modules\css-loader\dist\cjs.js!X:\PRPL\webpack-license-plugin-conflict-issue\src\style.css, isChild: true

called optimizeChunkAssets
asset: oss-licenses.json, size: 1337
[
  {
    "name": "css-loader",
    "version": "6.2.0",
    "author": "Tobias Koppers @sokra",
    "repository": null,
    "source": "https://registry.npmjs.org/css-loader/-/css-loader-6.2.0.tgz",
    "license": "MIT",
    "licenseText": "Copyright JS Foundation and other contributors\n\nPermission is hereby granted, free of charge, to any person obtaining\na copy of this software and associated documentation files (the\n'Software'), to deal in the Software without restriction, in
cluding\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to\npermit persons to whom the Software is furnished to do so, subject to\nthe following conditions:\n\nThe above copyright
notice and this permission notice shall be\nincluded in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,\nEXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNE
SS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.\nIN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY\nCLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,\nTORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE\nSOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n"
  }
]

called optimizeChunkAssets
asset: oss-licenses.json, size: 2
[]
asset: main.css, size: 255
asset: main.js, size: 3423

called emit

assetEmitted: targetPath X:\PRPL\webpack-license-plugin-conflict-issue\dist\oss-licenses.json

assetEmitted: targetPath X:\PRPL\webpack-license-plugin-conflict-issue\dist\main.css

assetEmitted: targetPath X:\PRPL\webpack-license-plugin-conflict-issue\dist\index.html

assetEmitted: targetPath X:\PRPL\webpack-license-plugin-conflict-issue\dist\main.js
```

Both html-webpack-plugin and mini-css-extract-plugin spawn child compilers which trigger the `compilation` hook again.
webpack-license-plugin also listens to the `compilation` hook and therefore tries to create own `oss-license.json` files
for each child compilation. The `ERROR in Conflict` error propbably happens when webpack tries to merge the child
compilations.
