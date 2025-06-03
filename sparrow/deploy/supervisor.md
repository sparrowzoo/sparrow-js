centos 安装
---

```aidl
yum install -y supervisor
```

说明文档
---
https://sparrowzoo.feishu.cn/docx/E9X0d5Zt9oSY28x2Hjqcv7e1nLg

config
---

```
;[unix_http_server]
;file=/tmp/supervisor.sock ;UNIX socket 文件，supervisorctl 会使用
;chmod=0700 ;socket文件的mode，默认是0700
;chown=nobody:nogroup ;socket文件的owner，格式：uid:gid
[inet_http_server]
port=127.0.0.1:9001
username=user
password=123

[supervisord]
logfile=/var/log/supervisor/supervisord.log  ; (main log file;default $CWD/supervisord.log)
logfile_maxbytes=50MB       ; (max main logfile bytes b4 rotation;default 50MB)
logfile_backups=10          ; (num of main logfile rotation backups;default 10)
loglevel=info               ; (log level;default info; others: debug,warn,trace)
pidfile=/run/supervisord.pid ; (supervisord pidfile;default supervisord.pid)
nodaemon=false              ; (start in foreground if true;default false)
minfds=1024                 ; (min. avail startup file descriptors;default 1024)
minprocs=200                ; (min. avail process descriptors;default 200)


[supervisorctl]
serverurl=unix:// //run/supervisor/supervisor.sock; use a unix:// URL  for a unix socket




[program:tomcat]
command=/root/tomcat-sparrow/bin/catalina.sh run
user=www
startsecs=60
startretries=3
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/catalina_err.log
stdout_logfile=/var/log/supervisor/catalina_out.log
```

