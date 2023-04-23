/*
 * @Author: lizhigang
 * @Date: 2023-04-20 17:21:20
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import styles from './index.module.scss';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ChangeEvent, useState } from 'react';
import { Button, Input, message } from 'antd';
import request from 'service/base';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const Editor = () => {
  const { push } = useRouter();
  const store = useStore();
  const { id: userId } = store.user.userInfo;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const publish = async () => {
    try {
      if (!title) {
        message.warning('请输入标题');
        return;
      } else {
        const { code, msg } = await request.post('/api/article/publish', {
          title,
          content,
        });
        if (code === 0) {
          message.success('发布成功');
          push(userId ? `/user/${userId}` : '/');
        } else {
          message.error(msg || '发布失败');
        }
      }
    } catch (error) {
      console.error(error);
      message.error(error.msg || '发布失败');
    }
  };
  return (
    <div className={styles.editorWrapper}>
      <div className={styles.opration}>
        <Input
          placeholder="请输入文章标题"
          value={title}
          style={{ borderRadius: 0 }}
          onChange={handleTitleChange}
        />
        <Button type="primary" style={{ borderRadius: 0 }} onClick={publish}>
          发布
        </Button>
      </div>
      <MDEditor value={content} onChange={setContent} />
    </div>
  );
};

Editor.layout = null;

export default observer(Editor);
