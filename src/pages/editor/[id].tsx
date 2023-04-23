/*
 * @Author: lizhigang
 * @Date: 2023-04-23 13:48:09
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
import { Articles } from 'index';
import { appDataSource } from '../../../db';
import { Article } from '../../../db/entity';

interface ModifyProps {
  article: Articles;
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export async function getServerSideProps({ params }) {
  try {
    const articleId = params?.id;
    const db = !appDataSource.isInitialized
      ? await appDataSource.initialize()
      : appDataSource;
    const articleRepo = db?.getRepository(Article);
    const article = await articleRepo.findOne({
      where: {
        id: articleId,
      },
      relations: ['user'],
    });
    return {
      props: {
        article: JSON.parse(JSON.stringify(article)) || [],
      },
    };
  } catch (e) {
    return {
      props: {
        article: [],
      },
    };
  }
}

const Modifyditor = ({ article }: ModifyProps) => {
  const { push, query } = useRouter();
  const store = useStore();
  const { id: userId } = store.user.userInfo;
  const [title, setTitle] = useState(article.title ?? '');
  const [content, setContent] = useState(article.content ?? '');
  const articleId = query.id;
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const publish = async () => {
    try {
      if (!title) {
        message.warning('请输入标题');
        return;
      } else {
        const { code, msg } = await request.post('/api/article/update', {
          id: articleId,
          title,
          content,
        });
        if (code === 0) {
          message.success('更新成功');
          push(articleId ? `/article/${articleId}` : '/');
        } else {
          message.error(msg || '更新失败');
        }
      }
    } catch (error) {
      console.error(error);
      message.error(error.msg || '更新失败');
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

Modifyditor.layout = null;

export default observer(Modifyditor);
