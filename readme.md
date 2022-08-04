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


## supervisor 报错

```
entered FATAL state, too many start retries too quickly
```

## 解决方案
- tomcat 启动用run 非start start 为守护进程无法监控
```
/root/tomcat-sparrow/bin/catalina.sh run
```
- 为 supervisor 创建新用户 否则启动后无法监控其状态 导致重试
```
chown -R www:www /root/tomcat-sparrow
chown -R www:www /var/log/supervisor
chown -R www:www /var/log/sparrow
chown -R www:www /workspace/upload
sudo chmod -R 750 /workspace/upload

750 表示文件所有者有读、写、执行权限，文件组有读、执行权限，其他用户没有权限

属主：rwx=4+2+1=7。
属组：r-x=4+0+1=5。
其他：---=0+0+0=0
```