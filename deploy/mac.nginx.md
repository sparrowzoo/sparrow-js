# 验证配置文件

% sudo /opt/homebrew/bin/nginx -tc /opt/homebrew/etc/nginx/nginx.conf

```
sudo chown -R nginx:nginx /Users/zhanglizhi/upload
sudo chmod -R 750 /Users/zhanglizhi/upload

```

# 指定配置文件

% sudo /opt/homebrew/bin/nginx -c /opt/homebrew/etc/nginx/nginx.conf

# 指定配置文件重启

sudo /opt/homebrew/bin/nginx -s reload -c /opt/homebrew/etc/nginx/nginx.conf

# 平滑重启

kill -HUP pid
