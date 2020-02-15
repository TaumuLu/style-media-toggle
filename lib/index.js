(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.MediaToggle = factory());
}(this, (function () { 'use strict';

  var MediaToggle = /** @class */ (function () {
      function MediaToggle(rule) {
          this.cssMediaRules = [];
          this.cssTexts = [];
          this.addRule(rule);
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
      MediaToggle.prototype.toggle = function () {
          var _this = this;
          if (this.cssTexts.length) {
              while (this.cssTexts.length) {
                  this.cssMediaRules.forEach(function (rule) {
                      var cssText = _this.cssTexts.shift();
                      cssText.forEach(function (text) { return rule.insertRule(text, rule.cssRules.length); });
                  });
              }
          }
          else {
              this.cssTexts = this.cssMediaRules.reduce(function (p, c) {
                  p.push(Array.from(c.cssRules, function (rule, i) {
                      c.deleteRule(i);
                      return rule.cssText;
                  }));
                  return p;
              }, []);
          }
      };
      return MediaToggle;
  }());
  var getWatch = function (observer) { return function () {
      var mediaRules = [];
      Array.from(document.styleSheets).forEach(function (styleSheet) {
          try {
              var cssRules = styleSheet.cssRules;
              Array.from(cssRules).forEach(function (rule) {
                  if (rule instanceof CSSMediaRule) {
                      mediaRules.push(rule);
                  }
              });
          }
          catch (e) {
              // console.info(e)
          }
      });
      observer(mediaRules);
  }; };
  var bindDomObserver = function (watch) {
      if (typeof MutationObserver !== 'undefined' && MutationObserver) {
          var observer = new MutationObserver(watch);
          observer.observe(document, { childList: true, subtree: true });
      }
      else {
          document.addEventListener('DOMSubtreeModified', watch);
      }
  };
  var getMediaToggle = function () {
      var subscribers = [];
      var mediaMap = new Map();
      bindDomObserver(getWatch(function (mediaRules) {
          mediaRules.forEach(function (mediaRule) {
              var conditionText = mediaRule.conditionText;
              var value = mediaMap.get(conditionText);
              if (value) {
                  value.addRule(mediaRule);
              }
              else {
                  mediaMap.set(conditionText, new MediaToggle(mediaRule));
              }
          });
          subscribers.forEach(function (fn) { return fn(); });
      }));
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
  var index = getMediaToggle();
  //# sourceMappingURL=index.js.map

  return index;

})));
