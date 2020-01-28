const withCSS = require('@zeit/next-css')
const withLess = require('@zeit/next-less')

const isProd = process.env.NODE_ENV === 'production'

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => { }
}

module.exports = withLess(withCSS({
  lessLoaderOptions: {
    javascriptEnabled: true
  }
}))