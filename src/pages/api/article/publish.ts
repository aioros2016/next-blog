/*
 * @Author: lizhigang
 * @Date: 2023-04-21 10:47:07
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { User } from 'db/entity/user';
import request from 'service/base';
import { Cookie } from 'next-cookie';
import { appDataSource } from 'db';
import { Article, UserAuth } from 'db/entity';
import { setCookie } from 'utils';
import { sessionUserInfo } from '@/pages/api/user/login';
import { Isession } from 'index';
import { EXCEPTION_ARTICLE } from '../config/codes';

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: Isession = req.session;
  const { title, content } = req.body;
  const db = await appDataSource.initialize();
  const userRepo = db.getRepository(User);
  const articleRepo = db.getRepository(Article);
  const user = await userRepo.findOne({
    where: { id: session.id },
  });
  const article = await new Article();
  article.title = title;
  article.content = content;
  article.create_time = new Date();
  article.update_time = new Date();
  article.is_delete = false;
  article.views = 0;
  console.log(user, article);
  if (user) {
    article.user = user;
  }
  const resArticle = await articleRepo.save(article);
  if (resArticle) {
    res.status(200).json({
      code: 0,
      msg: '发布成功',
      data: resArticle,
    });
  } else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.PUBLISH_FAILED });
  }
}
