var easySearchDirective = require('./lib/easy-search')

var EasySearch = {
  install: function(Vue, options) {
    Vue.directive('esearch', easySearchDirective(options))
  }
}
