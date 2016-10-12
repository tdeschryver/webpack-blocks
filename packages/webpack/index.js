/**
 * Webpack base config block.
 *
 * @see https://webpack.github.io/docs/configuration.html
 */

const path = require('path')
const core = require('@webpack-blocks/core')

exports.createConfig = createConfig
exports.env = core.env

exports.addPlugins = addPlugins
exports.customConfig = customConfig
exports.entryPoint = entryPoint
exports.resolveAliases = resolveAliases
exports.setContext = setContext
exports.setDevTool = setDevTool
exports.setOutput = setOutput
exports.sourceMaps = sourceMaps

/**
 * Wraps @webpack-blocks/core's `createConfig` to provide some sane default
 * configuration first.
 *
 * @param {Function[]} configSetters  Array of functions as returned by webpack blocks.
 * @return {object}                   Webpack config object.
 */
function createConfig (configSetters) {
  return core.createConfig([ createBaseConfig ].concat(configSetters))
}

function createBaseConfig (fileTypes) {
  return {
    module: {
      loaders: [
        {
          test: fileTypes('text/css'),
          exclude: [ /\/node_modules\// ],
          loaders: [ 'style', 'css' ]
        }, {
          test: fileTypes('image'),
          loaders: [ 'file' ]
        }, {
          test: fileTypes('application/font'),
          loaders: [ 'file' ]
        }, {
          test: fileTypes('application/json'),
          loaders: [ 'json' ]
        }, {
          test: fileTypes('audio'),
          loaders: [ 'url' ]
        }, {
          test: fileTypes('video'),
          loaders: [ 'url' ]
        }
      ]
    },

    resolve: {
      extensions: [ '.js', '.jsx', '.json', '' ]
    }
  }
}

/**
 * @see https://webpack.github.io/docs/configuration.html#entry
 */
function entryPoint (entry) {
  return () => ({
    entry: typeof entry === 'string' ? [ entry ] : entry
  })
}

/**
 * @see https://webpack.github.io/docs/configuration.html#plugins
 */
function addPlugins (plugins) {
  return () => ({ plugins })
}

function customConfig (wpConfig) {
  return () => wpConfig
}

/**
 * @see https://webpack.github.io/docs/configuration.html#resolve-alias
 */
function resolveAliases (aliases) {
  return () => ({
    resolve: {
      alias: aliases
    }
  })
}

/**
 * @see https://webpack.github.io/docs/configuration.html#context
 */
function setContext (contextPath) {
  return () => ({
    context: contextPath
  })
}

/**
 * @see https://webpack.github.io/docs/configuration.html#devtool
 */
function setDevTool (devtool) {
  return () => ({ devtool })
}

/**
 * @see https://webpack.github.io/docs/configuration.html#output
 */
function setOutput (output) {
  if (typeof output === 'string') {
    return setOutput({
      filename: path.basename(output) || 'bundle.js',
      path: path.dirname(output) || './build'
    })
  }

  return () => ({ output })
}

/**
 * Just a convenience wrapper to enable sourcemaps in an easier-to-read fashion
 * than `setDevTool()`.
 * @TODO: Only sets the javascript sourcemaps now. Would be nice to make loaders
 *        enable their specific sourcemaps when `sourceMaps()` is used.
 *
 * @param {string} [devtool]
 * @return {Function}
 */
function sourceMaps (devtool) {
  return setDevTool(devtool || 'cheap-module-source-map')
}