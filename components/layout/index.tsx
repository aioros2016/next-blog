/*
 * @Author: lizhigang
 * @Date: 2023-04-15 14:36:04
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import styles from './index.module.scss';
import React from 'react';
import Navbar from 'components/navbar';
import Footer from 'components/footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.container}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
