(function(){"use strict";var n={},t={};function e(r){var o=t[r];if(void 0!==o)return o.exports;var u=t[r]={id:r,exports:{}};return n[r].call(u.exports,u,u.exports,e),u.exports}e.m=n,function(){var n="function"===typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",t="function"===typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",r="function"===typeof Symbol?Symbol("webpack error"):"__webpack_error__",o=function(n){n&&!n.d&&(n.d=1,n.forEach((function(n){n.r--})),n.forEach((function(n){n.r--?n.r++:n()})))},u=function(e){return e.map((function(e){if(null!==e&&"object"===typeof e){if(e[n])return e;if(e.then){var u=[];u.d=0,e.then((function(n){i[t]=n,o(u)}),(function(n){i[r]=n,o(u)}));var i={};return i[n]=function(n){n(u)},i}}var c={};return c[n]=function(){},c[t]=e,c}))};e.a=function(e,i,c){var f;c&&((f=[]).d=1);var a,l,s,p=new Set,d=e.exports,b=new Promise((function(n,t){s=t,l=n}));b[t]=d,b[n]=function(n){f&&n(f),p.forEach(n),b["catch"]((function(){}))},e.exports=b,i((function(e){var o;a=u(e);var i=function(){return a.map((function(n){if(n[r])throw n[r];return n[t]}))},c=new Promise((function(t){o=function(){t(i)},o.r=0;var e=function(n){n!==f&&!p.has(n)&&(p.add(n),n&&!n.d&&(o.r++,n.push(o)))};a.map((function(t){t[n](e)}))}));return o.r?c:i()}),(function(n){n?s(b[r]=n):l(d),o(f)})),f&&(f.d=0)}}(),function(){var n=[];e.O=function(t,r,o,u){if(!r){var i=1/0;for(l=0;l<n.length;l++){r=n[l][0],o=n[l][1],u=n[l][2];for(var c=!0,f=0;f<r.length;f++)(!1&u||i>=u)&&Object.keys(e.O).every((function(n){return e.O[n](r[f])}))?r.splice(f--,1):(c=!1,u<i&&(i=u));if(c){n.splice(l--,1);var a=o();void 0!==a&&(t=a)}}return t}u=u||0;for(var l=n.length;l>0&&n[l-1][2]>u;l--)n[l]=n[l-1];n[l]=[r,o,u]}}(),function(){e.n=function(n){var t=n&&n.__esModule?function(){return n["default"]}:function(){return n};return e.d(t,{a:t}),t}}(),function(){e.d=function(n,t){for(var r in t)e.o(t,r)&&!e.o(n,r)&&Object.defineProperty(n,r,{enumerable:!0,get:t[r]})}}(),function(){e.f={},e.e=function(n){return Promise.all(Object.keys(e.f).reduce((function(t,r){return e.f[r](n,t),t}),[]))}}(),function(){e.u=function(n){return"static/js/"+n+".js"}}(),function(){e.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(n){if("object"===typeof window)return window}}()}(),function(){e.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)}}(),function(){var n={},t="Sparrow-MOBILE-CHAT:";e.l=function(r,o,u,i){if(n[r])n[r].push(o);else{var c,f;if(void 0!==u)for(var a=document.getElementsByTagName("script"),l=0;l<a.length;l++){var s=a[l];if(s.getAttribute("src")==r||s.getAttribute("data-webpack")==t+u){c=s;break}}c||(f=!0,c=document.createElement("script"),c.charset="utf-8",c.timeout=120,e.nc&&c.setAttribute("nonce",e.nc),c.setAttribute("data-webpack",t+u),c.src=r),n[r]=[o];var p=function(t,e){c.onerror=c.onload=null,clearTimeout(d);var o=n[r];if(delete n[r],c.parentNode&&c.parentNode.removeChild(c),o&&o.forEach((function(n){return n(e)})),t)return t(e)},d=setTimeout(p.bind(null,void 0,{type:"timeout",target:c}),12e4);c.onerror=p.bind(null,c.onerror),c.onload=p.bind(null,c.onload),f&&document.head.appendChild(c)}}}(),function(){e.r=function(n){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})}}(),function(){e.p="/chat/m/"}(),function(){e.b=document.baseURI||self.location.href;var n={runtime:0};e.f.j=function(t,r){var o=e.o(n,t)?n[t]:void 0;if(0!==o)if(o)r.push(o[2]);else if("runtime"!=t){var u=new Promise((function(e,r){o=n[t]=[e,r]}));r.push(o[2]=u);var i=e.p+e.u(t),c=new Error,f=function(r){if(e.o(n,t)&&(o=n[t],0!==o&&(n[t]=void 0),o)){var u=r&&("load"===r.type?"missing":r.type),i=r&&r.target&&r.target.src;c.message="Loading chunk "+t+" failed.\n("+u+": "+i+")",c.name="ChunkLoadError",c.type=u,c.request=i,o[1](c)}};e.l(i,f,"chunk-"+t,t)}else n[t]=0},e.O.j=function(t){return 0===n[t]};var t=function(t,r){var o,u,i=r[0],c=r[1],f=r[2],a=0;if(i.some((function(t){return 0!==n[t]}))){for(o in c)e.o(c,o)&&(e.m[o]=c[o]);if(f)var l=f(e)}for(t&&t(r);a<i.length;a++)u=i[a],e.o(n,u)&&n[u]&&n[u][0](),n[u]=0;return e.O(l)},r=self["webpackChunkSparrow_MOBILE_CHAT"]=self["webpackChunkSparrow_MOBILE_CHAT"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))}()})();