# style-media-toggle

切换当前@media 查询应用的样式

## 安装

```
npm install style-media-toggle --save
```

## 说明

css 中@media 的样式 js 无法操作，如果想取消某类或某条@media 的样式规则很麻烦，相关的操作库也没有找到  
需要自己去 documen.stylesheets 找到这条规则，要考虑当前规则是否被覆盖，以及以后 stylesheets 更新后当前规则是否会被覆盖  
初衷是每次看微信公众号的文章时通过 chrome 打开，由于 mac 是暗色主题，页面 css 中的`(prefers-color-scheme: dark)`这个@media 规则会导致网页为暗色很不喜欢，想有地方能快速切换@media 的应用规则  
通过 tampermonkey 或者 chrome 扩展程序提供可视化切换操作

## 使用

```js
import mediaToggle from 'style-media-toggle'

mediaToggle.get()
// 切换所有媒体查询的样式
mediaToggle.toggle()
mediaToggle.subscribe()
```
