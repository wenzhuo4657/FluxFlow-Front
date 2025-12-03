# dailyWeb-Front
日报程序前端


# 部署
### 1,nginx配置
```
server {
    listen 80;
    server_name ${domain};

    location /md-web/ {
        alias /var/www/daily/;
        try_files $uri $uri/ /md-web/index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        add_header Access-Control-Allow-Origin "*" always;
        add_header Vary "Origin" always;

        if ($request_method = OPTIONS) {
            return 204;
        }
    }
}
```

### 环境变量配置
```
VITE_API_BASE=${DAILY_WEB_API_URL}   #后端程序的地址，不需要配置后缀/api,例如，test.wenzhuo4657

VITE_BACKGROUD=${DAILY_WEB_BACKGROUND_URL}  # 背景图片的url地址
```
