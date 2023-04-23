/*
 * @Author: lizhigang
 * @Date: 2023-04-23 14:56:57
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { User } from 'db/entity/user';
import { appDataSource } from 'db';
import { Article, Comment } from 'db/entity';
import { Isession } from 'index';
import { EXCEPTION_COMMENT } from '../config/codes';

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: Isession = req.session;
  const { id, content } = req.body;
  const db = !appDataSource.isInitialized
    ? await appDataSource.initialize()
    : appDataSource;
  const commentRepo = db.getRepository(Comment);
  const commnet = new Comment();
  commnet.content = content;
  commnet.create_time = new Date();
  commnet.update_time = new Date();

  const userRepo = db.getRepository(User);
  const articleRepo = db.getRepository(Article);
  const user = await userRepo.findOne({
    where: { id: session.id },
  });
  const article = await articleRepo.findOne({
    where: { id },
  });
  if (user) {
    commnet.user = user;
  }
  if (article) {
    commnet.article = article;
  }
  const resComment = await commentRepo.save(commnet);
  if (resComment) {
    res.status(200).json({
      code: 0,
      msg: '发表评论成功',
      data: resComment,
    });
  } else {
    res.status(200).json({ ...EXCEPTION_COMMENT.PUBLISH_FAILED });
  }
}
