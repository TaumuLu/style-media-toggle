class MediaToggle {
  constructor(rule: CSSMediaRule) {
    this.addRule(rule)
  }

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

  toggle() {
    if (this.cssTexts.length) {
      while (this.cssTexts.length) {
        this.cssMediaRules.forEach(rule => {
          const cssText = this.cssTexts.shift()
          cssText.forEach(text => rule.insertRule(text, rule.cssRules.length))
        })
      }
    } else {
      this.cssTexts = this.cssMediaRules.reduce<string[][]>((p, c) => {
        p.push(
          Array.from(c.cssRules, (rule, i) => {
            c.deleteRule(i)
            return rule.cssText
          })
        )
        return p
      }, [])
    }
  }
}

const getWatch = (observer: Function) => () => {
  const mediaRules: CSSMediaRule[] = []
  Array.from(document.styleSheets).forEach(styleSheet => {
    try {
      const { cssRules } = styleSheet as any
      Array.from(cssRules).forEach(rule => {
        if (rule instanceof CSSMediaRule) {
          mediaRules.push(rule)
        }
      })
    } catch (e) {
      // console.info(e)
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
}

const getMediaToggle = () => {
  const subscribers = []
  const mediaMap = new Map<string, MediaToggle>()
  bindDomObserver(
    getWatch(mediaRules => {
      mediaRules.forEach(mediaRule => {
        const { conditionText } = mediaRule
        const value = mediaMap.get(conditionText)
        if (value) {
          value.addRule(mediaRule)
        } else {
          mediaMap.set(conditionText, new MediaToggle(mediaRule))
        }
      })
      subscribers.forEach(fn => fn())
    })
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

export default getMediaToggle()
