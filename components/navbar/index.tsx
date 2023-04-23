/*
 * @Author: lizhigang
 * @Date: 2023-04-15 14:39:48
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import styles from './index.module.scss';
import { navs } from './config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Button, Dropdown, message } from 'antd';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import Login from '../login';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import request from 'service/base';

const Navbar = () => {
  const store = useStore();
  const { pathname, push } = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  console.log('userInfo:', store.user.userInfo);
  const { id, avatar } = store.user.userInfo;
  const onClick: MenuProps['onClick'] = ({ key, item }) => {
    console.log(key, item);
    switch (key) {
      case 'logout':
        logout();
        break;
      case 'userDetail':
        userDetail();
        break;
      default:
        console.log(key);
    }
  };
  const items: MenuProps['items'] = [
    {
      key: 'userDetail',
      label: <Button type="link">个人中心</Button>,
    },
    {
      key: 'logout',
      label: <Button type="link">登出</Button>,
    },
  ];
  const login = () => {
    setShowLogin(true);
  };
  const closeLogin = () => {
    setShowLogin(false);
  };

  const logout = async () => {
    try {
      const { code, msg } = await request.post('/api/user/logout');
      if (code === 0) {
        store.user.setUser({});
        message.success(msg);
      } else {
        message.warning(msg);
      }
    } catch (error) {
      message.error(error.msg);
    }
  };

  const home = () => {
    push('/');
  };

  const writeArticle = () => {
    if (!id) {
      message.warning('请先登录');
    } else {
      push('/editor/new');
    }
  };

  const userDetail = () => {
    push(`/user/${id}`);
  };

  return (
    <div className={styles.navbar}>
      <section className={styles.logo} onClick={home}>
        Logo
      </section>
      <section className={styles.navs}>
        {navs?.map((nav) => (
          <Link legacyBehavior key={nav?.label} href={nav?.value}>
            <a className={pathname === nav?.value ? styles.active : ''}>
              {nav?.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operation}>
        <Button onClick={writeArticle}>写文章</Button>
        {id ? (
          <Dropdown menu={{ items, onClick }} placement="topRight" arrow>
            <Avatar
              style={{ marginLeft: '10px' }}
              src={<img src={avatar} alt="avatar" />}
            />
          </Dropdown>
        ) : (
          <Button type="primary" onClick={login}>
            登录
          </Button>
        )}
      </section>
      <Login show={showLogin} onClose={closeLogin} />
    </div>
  );
};

export default observer(Navbar);
