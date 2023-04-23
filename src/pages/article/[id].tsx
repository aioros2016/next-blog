/*
 * @Author: lizhigang
 * @Date: 2023-04-23 09:52:30
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import styles from './index.module.scss';
import { appDataSource } from 'db';
import { Article } from 'db/entity/article';
import { Articles } from 'index';
import { Avatar, Button, Input, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import Link from 'next/link';
import Markdown from 'markdown-to-jsx';
import dayjs from 'dayjs';
import { useState } from 'react';
import request from 'service/base';

interface DetailProps {
  article: Articles;
}

export async function getServerSideProps({ params }) {
  console.log('params', params);
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
      relations: ['user', 'comments', 'comments.user'],
    });
    if (article) {
      article.views += 1;
      await articleRepo?.save(article);
    }
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

const ArticleDetail = (props: DetailProps) => {
  const store = useStore();
  const userInfo = store?.user?.userInfo;
  const { article } = props;
  const [commentVal, setCommentVal] = useState('');
  const [commentList, setCommentList] = useState(article.comments || []);
  console.log('article', article);
  const {
    user: { id, nickname, avatar },
    comments,
  } = article;

  const comment = async () => {
    try {
      const { code } = await request.post('/api/comment/publish', {
        id: article.id,
        content: commentVal,
      });
      if (code === 0) {
        message.success('发表评论成功');
        setCommentVal('');
        const newComment: any = {
          id: Math.random(),
          create_time: new Date(),
          update_time: new Date(),
          content: commentVal,
          user: {
            avatar: userInfo?.avatar,
            nickname: userInfo?.nickname,
          },
        };
        setCommentList([newComment, ...commentList]);
      } else {
        message.error('发表评论失败');
      }
    } catch (e) {
      message.error('发表评论失败');
    }
  };

  return (
    <div className={styles.detailContainer}>
      <h2 className={styles.detailTitle}>{article.title}</h2>
      <div className={styles.user}>
        <Avatar src={avatar} />
        <div className={styles.info}>
          <div className={styles.name}>{nickname}</div>
          <div className={styles.date}>
            <div>
              {dayjs(article.update_time).format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <div>阅读 {article.views}</div>
            {Number(userInfo?.id) === Number(id) && (
              <Link href={`/editor/${article.id}`}>编辑</Link>
            )}
          </div>
        </div>
      </div>
      <Markdown className={styles.markdown}>{article.content}</Markdown>
      <div className={styles.comments}>
        {commentList.map((comment) => (
          <div className={styles.commentWrap} key={comment.id}>
            <Avatar src={comment.user.avatar} />
            <div className={styles.userInfo}>
              <div className={styles.name}>{comment.user.nickname}</div>
              <div className={styles.date}>
                <div>
                  {dayjs(article.update_time).format('YYYY-MM-DD HH:mm:ss')}
                </div>
                {Number(userInfo?.id) === Number(id) && (
                  <Link href={`/editor/${article.id}`}>编辑</Link>
                )}
              </div>
            </div>
            <div className={styles.commentContent}>{comment.content}</div>
          </div>
        ))}
      </div>
      <div className={styles.commentArea}>
        <h3>评论</h3>
        {Number(userInfo?.id) && (
          <div className={styles.enter}>
            <Avatar src={userInfo?.avatar} />
            <div className={styles.content}>
              <Input.TextArea
                placeholder="请输入评论"
                rows={4}
                value={commentVal}
                onChange={(e) => setCommentVal(e.target.value)}
              />
            </div>
            <Button type="primary" onClick={comment}>
              发表评论
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(ArticleDetail);
