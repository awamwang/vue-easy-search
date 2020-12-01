var easySearchDirective = require('./lib/easy-search')

var EasySearch = {
  install: function(Vue, options = {}) {
    Vue.directive(options.directiveName || 'esearch', easySearchDirective(options))
  }
}

module.exports = EasySearch
