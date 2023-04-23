/*
 * @Author: lizhigang
 * @Date: 2023-04-20 11:16:36
 * @Company: www.smm.cn
 * @Description: 文件描述
 */

export interface UserInfo {
  userId: number;
  nickname: string;
  avatar: string;
}
export const setCookie = (
  cookie: any,
  { userId, nickname, avatar }: UserInfo
) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';
  cookie.set('userId', userId, {
    path,
    expires,
  });
  cookie.set('nickname', nickname, {
    path,
    expires,
  });
  cookie.set('avatar', avatar, {
    path,
    expires,
  });
};

export const clearCookie = (cookie: any) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';
  cookie.set('userId', '', {
    path,
    expires,
  });
  cookie.set('nickname', '', {
    path,
    expires,
  });
  cookie.set('avatar', '', {
    path,
    expires,
  });
};
