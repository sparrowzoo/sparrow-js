```aidl
Docroot is: /opt/homebrew/var/www

The default port has been set in /opt/homebrew/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.

nginx will load all files in /opt/homebrew/etc/nginx/servers/.

To restart nginx after an upgrade:
  brew services restart nginx
Or, if you don't want/need a background service you can just run:
  /opt/homebrew/opt/nginx/bin/nginx -g daemon off;
```

windows install node
---
https://nodejs.org/en/download/


gulp install
---
https://www.gulpjs.com.cn/docs/getting-started/

TypeError: Cannot read property 'apply' of undefined issue
---
https://github.com/gulpjs/gulp-cli/issues/84

build
---
- gulp dev
- gulp

add dependency
---
@package.json

"dependencies": {
    "babel-preset-es2017": "^6.24.1",
    "del": "^3.0.0",
    "gulp-babel": "^8.0.0",
    "gulp-clean-css": "^3.10.0",
    "gulp-concat": "^2.6.1",
    "gulp-less": "~4.0.1",
    "gulp-load-plugins": "^1.5.0",
    "gulp-rename": "^1.4.0",
    "gulp-uglify": "^3.0.1",
    "purecss": "^1.0.0"
  },

add purecss


