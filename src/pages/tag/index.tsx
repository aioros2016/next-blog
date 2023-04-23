/*
 * @Author: lizhigang
 * @Date: 2023-04-15 14:49:23
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import styles from './index.module.scss'
import { Button, Tabs } from "antd";
import type { TabsProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import request from 'service/base';
import { useEffect, useState } from "react";
import { Tag } from 'index';
import * as antdIcon from '@ant-design/icons'

const TagComponents = () => {
  const store = useStore();
  const { id} = store.user.userInfo
  const [followTags, setFollowTags] = useState< Tag[] >([]);
  const [allTags, setAllTags] = useState< Tag[] >([]);
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: `全部标签`,
      children: <div>
        {allTags?.length && allTags.map(tag => (
          <div key={tag.id} className={styles.tag}>
            <div>{antdIcon[tag.icon].render()}</div>
            <div>{tag.title}</div>
            <div>{tag.follow_count} 关注 {tag.article_count} 文章</div>
          </div>
        ))}
      </div>,
    },
    {
      key: 'follow',
      label: `已关注标签`,
      children: <div>
        {!!followTags?.length && followTags.map(tag => (
          <div key={tag.id} className={styles.tag}>
            <div>{antdIcon[tag.icon].render()}</div>
            <div>{tag.title}</div>
            <div>{tag.follow_count} 关注 {tag.article_count} 文章</div>
            {
              tag.users.find(user => Number(user.id) === Number(id)) ? (
                <Button type='primary' onClick={() => handleUnFollow(tag.id)}>已关注</Button>
              ) : (
                <Button type='primary' onClick={() => handleFollow(tag.id)}>关注</Button>
              )
            }
          </div>
        ))}
      </div>,
    }
  ];

  const handleUnFollow = () => {

  }

  const handleFollow = () => {

  }

  const fetchTags = async () => {
    try {
      const { code, data } = await request('/api/tag/get');
      if (code === 0) {
        const { followTags = [], allTags = [] } = data;
        setFollowTags(followTags)
        setAllTags(allTags)
      }
    } catch (e) {

    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return (
    <div>
      <Tabs defaultActiveKey="all" items={items} onChange={onChange} />
    </div>
  );
};

export default observer(TagComponents);
