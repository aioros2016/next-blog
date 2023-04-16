/*
 * @Author: lizhigang
 * @Date: 2023-04-16 16:00:12
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import * as process from 'process';

export const ironOptions = {
  cookieName: process.env.SESSION_COOKIE_NAME!,
  password: process.env.SESSION_PASSWORD!,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
  },
};
