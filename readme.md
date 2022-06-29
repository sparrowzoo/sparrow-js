install node
---
https://nodejs.org/en/download/

gulp install
---
https://www.gulpjs.com.cn/docs/getting-started/


build
---
- gulp dev
- gulp



nginx
---
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

TypeError: Cannot read property 'apply' of undefined issue
---
https://github.com/gulpjs/gulp-cli/issues/84
