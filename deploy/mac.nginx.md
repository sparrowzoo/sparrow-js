# 验证配置文件

% sudo /opt/homebrew/bin/nginx -tc /opt/homebrew/etc/nginx/nginx.conf

# 指定配置文件

% sudo /opt/homebrew/bin/nginx -c /opt/homebrew/etc/nginx/nginx.conf

# 指定配置文件重启

sudo /opt/homebrew/bin/nginx -s reload -c /opt/homebrew/etc/nginx/nginx.conf

# 平滑重启

kill -HUP pid
