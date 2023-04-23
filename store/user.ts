/*
 * @Author: lizhigang
 * @Date: 2023-04-19 17:03:37
 * @Company: www.smm.cn
 * @Description: 文件描述
 */

export interface UserInfo {
  id?: number | null;
  nickname?: string;
  avatar?: string;
}
export interface User {
  userInfo: UserInfo;
  setUser: (value: UserInfo) => void;
}

const userStore = (): User => ({
  userInfo: {},
  setUser(value) {
    this.userInfo = value;
  },
});

export default userStore;
