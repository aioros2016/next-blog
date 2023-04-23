/*
 * @Author: lizhigang
 * @Date: 2023-04-23 17:06:22
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { appDataSource } from 'db';
import { Tag } from 'db/entity';
import { Isession } from 'index';
import { EXCEPTION_ARTICLE } from '../config/codes';

export default withIronSessionApiRoute(get, ironOptions);

async function get(req: NextApiRequest, res: NextApiResponse) {
  const session: Isession = req.session;
  const { userId = 0 } = session;
  const db = !appDataSource.isInitialized
    ? await appDataSource.initialize()
    : appDataSource;
  const tagRepo = db.getRepository(Tag);
  const follewTags = tagRepo.find({
    relations: ['users'],
    where: (qb: any) => {
      qb.where('user_id === :id', {
        id: Number(userId),
      });
    },
  });

  const allTags = await tagRepo.find({
    relations: ['users'],
  });
  // console.log('allTags', allTags);

  res.status(200).json({
    code: 0,
    msg: '',
    data: {
      allTags,
      follewTags,
    },
  });
}
