export function DeepLinker(options) {
  if (!options) {
    throw new Error('no options')
  }

  var hasFocus = true
  var didHide = false

  // window is blurred when dialogs are shown
  function onBlur() {
    hasFocus = false
  }
  this.setFocus = (value) => {
    hasFocus = value
  }

  // document is hidden when native app is shown or browser is backgrounded
  function onVisibilityChange(e) {
    if (e.target.visibilityState === 'hidden') {
      didHide = true
    }
  }

  // window is focused when dialogs are hidden, or browser comes into view
  function onFocus() {
    if (didHide) {
      if (options.onReturn) {
        options.onReturn()
      }

      didHide = false // reset
    } else {
      // ignore duplicate focus event when returning from native app on
      // iOS Safari 13.3+
      if (!hasFocus && options.onFallback) {
        // wait for app switch transition to fully complete - only then is
        // 'visibilitychange' fired
        setTimeout(function () {
          // if browser was not hidden, the deep link failed
          if (!didHide) {
            options.onFallback()
          }
        }, 1000)
      }
    }

    hasFocus = true
  }

  function bindEvents(mode) {
    ;[
      [window, 'blur', onBlur],
      [document, 'visibilitychange', onVisibilityChange],
      [window, 'focus', onFocus],
    ].forEach(function (conf) {
      conf[0][mode + 'EventListener'](conf[1], conf[2])
    })
  }

  bindEvents('add')

  this.destroy = bindEvents.bind(null, 'remove')
  this.openURL = function (url) {
    onBlur()
    var dialogTimeout = 500

    setTimeout(function () {
      if (hasFocus && options.onIgnored) {
        options.onIgnored()
      }
    }, dialogTimeout)

    window.location = url
  }
}
