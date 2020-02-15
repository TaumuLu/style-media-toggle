interface IQuiet {
  quiet?: boolean
  onError?: Function
}

class MediaToggle {
  constructor(options: IQuiet) {
    this.options = options
  }

  options: IQuiet = {}

  cssMediaRules: CSSMediaRule[] = []

  cssTexts: string[][] = []

  addRule(rule: CSSMediaRule) {
    this.cssMediaRules.push(rule)
  }

  get() {
    return this.cssMediaRules
  }

  delete() {
    this.cssMediaRules.forEach(rule => {
      while (rule.cssRules.length) {
        const index = rule.cssRules.length - 1
        rule.deleteRule(index)
      }
    })
  }

  get disabled() {
    return !!this.cssTexts.length
  }

  toggle = (flag = !this.disabled) => {
    if (flag) {
      this.cssTexts = this.cssMediaRules.reduce<string[][]>((p, c) => {
        p.push(
          Array.from(c.cssRules, (rule, i) => {
            c.deleteRule(i)
            return rule.cssText
          })
        )
        return p
      }, [])
    } else {
      while (this.cssTexts.length) {
        this.cssMediaRules.forEach(rule => {
          const cssText = this.cssTexts.shift()
          cssText.forEach(text => rule.insertRule(text, rule.cssRules.length))
        })
      }
    }
  }
}

const getWatch = (observer: Function, options: IQuiet = {}) => () => {
  const mediaRules: CSSMediaRule[] = []
  Array.from(document.styleSheets).forEach((styleSheet: any) => {
    try {
      const { disabled } = styleSheet
      if (!disabled) {
        const { cssRules } = styleSheet
        Array.from(cssRules).forEach(rule => {
          if (rule instanceof CSSMediaRule) {
            mediaRules.push(rule)
          }
        })
      }
    } catch (e) {
      const { quiet, onError } = options
      if (onError) {
        onError(e, styleSheet)
      } else if (quiet === false) {
        console.error(e)
      }
    }
  })
  observer(mediaRules)
}

const bindDomObserver = (watch: any) => {
  if (typeof MutationObserver !== 'undefined' && MutationObserver) {
    const observer = new MutationObserver(watch)
    observer.observe(document, { childList: true, subtree: true })
  } else {
    document.addEventListener('DOMSubtreeModified', watch)
  }
  watch()
}

const getMediaToggle = (options: IQuiet) => {
  const subscribers = []
  const mediaMap = new Map<string, MediaToggle>()
  bindDomObserver(
    getWatch(mediaRules => {
      mediaRules.forEach(mediaRule => {
        const { conditionText } = mediaRule
        const value = mediaMap.get(conditionText) || new MediaToggle(options)
        value.addRule(mediaRule)
        if (!mediaMap.has(conditionText)) {
          mediaMap.set(conditionText, value)
        }
      })
      subscribers.forEach(fn => fn())
    }, options)
  )

  return {
    get() {
      return mediaMap
    },
    toggle() {
      mediaMap.forEach(value => {
        value.toggle()
      })
    },
    subscribe(fn: any) {
      subscribers.push(fn)
      return () => {
        const index = subscribers.indexOf(fn)
        if (index !== -1) {
          subscribers.splice(index, 1)
        }
      }
    },
  }
}

export default getMediaToggle
