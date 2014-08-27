
var keyHandler = require('../lib/keys')

module.exports = keyHandlers

function keyHandlers(keys, actions, plugins) {
  var modes = ['visual', 'normal', 'insert']

  var collected = {}
  modes.forEach((mode) => collected[mode] = {})

  var collect = function (keys) {
    Object.keys(keys).forEach((name) => {
      modes.forEach((mode) => {
        if (keys[name][mode]) {
          collected[mode][name] = keys[name][mode]
        }
      })
    })
  }

  collect(keys)

  if (plugins) {
    plugins.forEach(collect)
  }

  return {
    visual: bindKeys(collected.visual, actions),
    normal: bindKeys(collected.normal, actions),
    insert: bindKeys(collected.insert, actions),
  }
}

function camel(name) {
  return name.replace(/ (\w)/g, (full, letter) => letter.toUpperCase())
}

function bindKeys(keys, actions) {
  var binds = {}
  Object.keys(keys).forEach((name) => {
    var action = camel(name)
    if (!actions[action]) {
      console.warn('[binding keys] unknown action: ' + action)
      return;
    }
    binds[keys[name]] = function(){actions[action]()}
  })
  return keyHandler(binds)
}
