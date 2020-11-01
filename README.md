# Shandong University Online Judge - Manage End

## Get started 
Make sure that `node v12.18.2` and `npm v6.14.5` or their higher version are installed.

### Development on Linux or macOS
```
npm install

# You should custom the file `.env.development` in the root directory and change your hosts to avoid CORS
# `VUE_APP_OJ_SERVER` is where your real backend locates at
# `VUE_APP_OJ_CLIENT` is where sduoj-web locates at

# serve with hot reload at localhost:8081
npm run serve
```

### Production
```
npm run build
```

We will give a template of nginx config file later.

## LICENSE
[GNU General Public License v3.0](https://github.com/SDUOJ/sduoj-manage/blob/master/LICENSE)
