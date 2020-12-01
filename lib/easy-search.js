const NAME = 'easy-search'

function parseConfig(binding, vnode) {
  var config = binding.expression
  var searchMethod,
    iconSearch,
    iconClass,
    lazy = binding.modifiers.lazy

  if (typeof config !== 'string' && typeof config !== 'object') {
    console.error(`${NAME} expression must be a string method name or object`)
  }

  iconSearch = binding.modifiers.icon
  if (typeof config === 'string') {
    searchMethod = vnode.context[config]
  } else {
    searchMethod = vnode.context[config].method || 'search'
    iconClass = config.iconClass
    if (iconClass) {
      iconSearch = true
    }
  }
  iconClass = iconClass || 'search'
  if (!searchMethod || typeof searchMethod !== 'function') {
    console.error(`${NAME} vm[${binding.expression}] not a method`)
  }

  return {
    searchMethod,
    iconSearch,
    iconClass,
    lazy
  }
}

function getInputElement(el) {
  if (el.tagName === 'INPUT') {
    return el
  } else {
    return el.getElementsByTagName('input')[0]
  }
}

function preventEnterChange(e) {
  if (e.keyCode == 13) {
    // 要想办法处理多个监听的情况
    e.preventDefault ? e.preventDefault() : (e.returnValue = false)
  }
}

function handleChange(e, callback) {
  // console.log('change', e)
  callback()
}

function handleEnter(e, callback) {
  if (e.keyCode == 13) {
    // console.log('enter')
    callback()
  }
}

function handleIconClick(e, callback) {
  // console.log('iconClick')
  callback()
}

function getIconElement(el, iconClass) {
  var icons = el.getElementsByTagName('I')
  for (let i = 0, len = icons.length; i < len; i++) {
    if (icons[i].className.includes(iconClass)) {
      return icons[i]
    }
  }
  return null
}

module.exports = function(options) {
  return {
    bind(el, binding, vnode) {
      var { searchMethod, iconSearch = options.iconSearch, iconClass = options.iconClass } = parseConfig(binding, vnode)
      var oldInput
      searchMethod = searchMethod.bind(vnode.context)

      el._easySearch = {}
      var input = el._easySearch.input = getInputElement(el)
      if (!input) return

      input.addEventListener('keydown', el._easySearch.keydown = preventEnterChange)
      input.addEventListener('change', el._easySearch.change = function(e) {
        handleChange(e, searchMethod)
      })
      input.addEventListener('keyup', el._easySearch.keyup = function(e) {
        handleEnter(e, searchMethod)
      })

      if (iconSearch) {
        var icon = el._easySearch.icon = getIconElement(el, iconClass)
        icon && icon.addEventListener('click', el._easySearch.iconClick = function(e) {
          handleIconClick(e, searchMethod)
        })
      }
    },
    unbind(el, binding, vnode, oldVnode) {
      if (el._easySearch.input) {
        el.removeEventListener("keydown", el._easySearch.keydown)
        el.removeEventListener("change", el._easySearch.change)
        el.removeEventListener("keyup", el._easySearch.keyup)
      }
      el._easySearch.icon && el._easySearch.icon.removeEventListener("click", el._easySearch.iconClick)
    }
  }
}
