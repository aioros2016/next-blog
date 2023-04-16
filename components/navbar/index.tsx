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
import { Button } from 'antd';
import { useState } from 'react';
import Login from '../login';

const Navbar = () => {
  const { pathname } = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const login = () => {
    setShowLogin(true);
  };
  const closeLogin = () => {
    setShowLogin(false);
  };

  return (
    <div className={styles.navbar}>
      <section className={styles.logo}>Logo</section>
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
        <Button>写文章</Button>
        <Button type="primary" onClick={login}>
          登录
        </Button>
      </section>
      <Login show={showLogin} onClose={closeLogin} />
    </div>
  );
};

export default Navbar;
