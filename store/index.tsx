/*
 * @Author: lizhigang
 * @Date: 2023-04-19 17:22:09
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import { createContext, ReactElement, useContext } from 'react';
import { useLocalObservable, enableStaticRendering } from 'mobx-react-lite';
import createStore, { RootStore } from './root';

interface ProviderProps {
  initialValue: Record<any, any>;
  children: ReactElement;
}

enableStaticRendering(typeof window === "undefined");

const StoreContext = createContext({});

export const StoreProvider = ({ initialValue, children }: ProviderProps) => {
  const store = useLocalObservable(createStore(initialValue));
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store: RootStore = useContext(StoreContext) as RootStore;
  if (!store) {
    throw new Error('数据不存在');
  }
  return store;
};
