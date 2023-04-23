/*
 * @Author: lizhigang
 * @Date: 2023-04-23 14:12:35
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { appDataSource } from 'db';
import { Article } from 'db/entity';
import { EXCEPTION_ARTICLE } from '../config/codes';

export default withIronSessionApiRoute(update, ironOptions);

async function update(req: NextApiRequest, res: NextApiResponse) {
  const { id = 0, title, content } = req.body;
  const db = !appDataSource.isInitialized
    ? await appDataSource.initialize()
    : appDataSource;
  const articleRepo = db.getRepository(Article);
  const article = await articleRepo.findOne({
    where: {
      id,
    },
    relations: ['user'],
  });
  if (article) {
    article.title = title;
    article.content = content;
    article.update_time = new Date();
    const resArticle = await articleRepo.save(article);
    if (resArticle) {
      res.status(200).json({
        code: 0,
        msg: '更新成功',
        data: resArticle,
      });
    } else {
      res.status(200).json({ ...EXCEPTION_ARTICLE.UPDATE_FAILED });
    }
  } else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.NOT_FOUND });
  }
}
