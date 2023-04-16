/*
 * @Author: lizhigang
 * @Date: 2023-04-16 14:09:27
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import axios from 'axios';

const requestInstance = axios.create({
  baseURL: '/',
});

requestInstance.interceptors.response.use(
  (response) => {
    const { status, data } = response;
    if (status === 200) {
      return data;
    } else {
      return {
        code: -1,
        msg: '未知错误',
        data: null,
      };
    }
  },
  (error) => Promise.reject(error)
);

export default requestInstance;
