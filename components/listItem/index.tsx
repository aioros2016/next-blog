/*
 * @Author: lizhigang
 * @Date: 2023-04-21 15:41:26
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import styles from './index.module.scss';
import Link from 'next/link';
import { Articles } from 'index';
import { EyeOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { markdownToTxt } from 'markdown-to-txt';

dayjs.extend(relativeTime);

interface Props {
  article: Articles;
}

const IconText = ({ icon, text }: { icon: React.FC, text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);
const ListItem = ({ article }: Props) => {
  const { id, user, title, content, views, update_time } = article;
  return (
    <Link href={`/article/${id}`}>
      <List.Item
        key={id}
        actions={[
          <IconText icon={EyeOutlined} text={views.toString()} key="views" />,
          <div key={update_time}>{dayjs(update_time).fromNow()}</div>,
        ]}
        extra={
          <img
            width={272}
            alt="logo"
            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          />
        }
      >
        <List.Item.Meta
          avatar={<Avatar src={user.avatar} />}
          title={user.nickname}
          description={title}
        />
        {markdownToTxt(content)}
      </List.Item>
    </Link>
  );
};

export default ListItem;
