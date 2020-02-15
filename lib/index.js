(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.getMediaToggle = factory());
}(this, (function () { 'use strict';

  var MediaToggle = /** @class */ (function () {
      function MediaToggle(options) {
          var _this = this;
          this.options = {};
          this.cssMediaRules = [];
          this.cssTexts = [];
          this.toggle = function (flag) {
              if (flag === void 0) { flag = !_this.disabled; }
              if (flag) {
                  _this.cssTexts = _this.cssMediaRules.reduce(function (p, c) {
                      p.push(Array.from(c.cssRules, function (rule, i) {
                          c.deleteRule(i);
                          return rule.cssText;
                      }));
                      return p;
                  }, []);
              }
              else {
                  while (_this.cssTexts.length) {
                      _this.cssMediaRules.forEach(function (rule) {
                          var cssText = _this.cssTexts.shift();
                          cssText.forEach(function (text) { return rule.insertRule(text, rule.cssRules.length); });
                      });
                  }
              }
          };
          this.options = options;
      }
      MediaToggle.prototype.addRule = function (rule) {
          this.cssMediaRules.push(rule);
      };
      MediaToggle.prototype.get = function () {
          return this.cssMediaRules;
      };
      MediaToggle.prototype.delete = function () {
          this.cssMediaRules.forEach(function (rule) {
              while (rule.cssRules.length) {
                  var index = rule.cssRules.length - 1;
                  rule.deleteRule(index);
              }
          });
      };
      Object.defineProperty(MediaToggle.prototype, "disabled", {
          get: function () {
              return !!this.cssTexts.length;
          },
          enumerable: true,
          configurable: true
      });
      return MediaToggle;
  }());
  var getWatch = function (observer, options) {
      if (options === void 0) { options = {}; }
      return function () {
          var mediaRules = [];
          Array.from(document.styleSheets).forEach(function (styleSheet) {
              try {
                  var disabled = styleSheet.disabled;
                  if (!disabled) {
                      var cssRules = styleSheet.cssRules;
                      Array.from(cssRules).forEach(function (rule) {
                          if (rule instanceof CSSMediaRule) {
                              mediaRules.push(rule);
                          }
                      });
                  }
              }
              catch (e) {
                  var quiet = options.quiet, onError = options.onError;
                  if (onError) {
                      onError(e, styleSheet);
                  }
                  else if (quiet === false) {
                      console.error(e);
                  }
              }
          });
          observer(mediaRules);
      };
  };
  var bindDomObserver = function (watch) {
      if (typeof MutationObserver !== 'undefined' && MutationObserver) {
          var observer = new MutationObserver(watch);
          observer.observe(document, { childList: true, subtree: true });
      }
      else {
          document.addEventListener('DOMSubtreeModified', watch);
      }
      watch();
  };
  var getMediaToggle = function (options) {
      var subscribers = [];
      var mediaMap = new Map();
      bindDomObserver(getWatch(function (mediaRules) {
          mediaRules.forEach(function (mediaRule) {
              var conditionText = mediaRule.conditionText;
              var value = mediaMap.get(conditionText) || new MediaToggle(options);
              value.addRule(mediaRule);
              if (!mediaMap.has(conditionText)) {
                  mediaMap.set(conditionText, value);
              }
          });
          subscribers.forEach(function (fn) { return fn(); });
      }, options));
      return {
          get: function () {
              return mediaMap;
          },
          toggle: function () {
              mediaMap.forEach(function (value) {
                  value.toggle();
              });
          },
          subscribe: function (fn) {
              subscribers.push(fn);
              return function () {
                  var index = subscribers.indexOf(fn);
                  if (index !== -1) {
                      subscribers.splice(index, 1);
                  }
              };
          },
      };
  };

  return getMediaToggle;

})));
