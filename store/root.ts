/*
 * @Author: lizhigang
 * @Date: 2023-04-19 17:13:21
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import userStore, { User } from './user';

export interface RootStore {
  user: User;
}
export default function createStore(initiaValue: any): () => RootStore {
  return () => {
    return {
      user: { ...userStore(), ...initiaValue?.user },
    };
  };
}
