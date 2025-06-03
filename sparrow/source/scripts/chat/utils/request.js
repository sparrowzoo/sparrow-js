define(['axios'], function (axios) {
  axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
  // 创建axios实例
  const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: 'http://studyapi.zhilongsoft.com',
    // 超时
    timeout: 20000,
  });

  // request拦截器
  service.interceptors.request.use(
    (config) => {
      // 是否需要设置 token
      if (localStorage.getItem('token')) {
        config.headers['X-Sugar-Token'] = localStorage.getItem('token'); // 让每个请求携带自定义token
      }
      return config;
    },
    (error) => {
      console.log(error);
      Promise.reject(error);
    }
  );

  // 响应拦截器
  service.interceptors.response.use(
    (res) => {
      // 未设置状态码则默认成功状态
      const code = res.data.code || 200;
      // 获取错误信息
      return res.data;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return { service };
});
