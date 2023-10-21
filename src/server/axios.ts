import axios from 'axios';

// const app_id = 'mroplaijmenoppmm'
// const app_secret = 'wGMFBtGtCZNtASFKoTI6pY6hvxiTT1Gs'
// const baseURL = 'https://graphql.anilist.co'
const baseURL = 'https://api.waifu.im/'

// const testURL = 'http://localhost:8001/test/'
// 创建一个自定义实例
const axiosInstance = axios.create({
  baseURL, // 设置基本的URL
  timeout: 5000, // 设置请求超时时间
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  config => {
    // 在发送请求之前可以进行一些处理，比如添加请求头等
    // config.headers['Authorization'] = 'Bearer ' + getToken();

    return config;
  },
  error => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  response => {
    // 对响应数据进行处理
    return response.data;
  },
  error => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

export default axiosInstance;