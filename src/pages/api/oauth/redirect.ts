/*
 * @Author: lizhigang
 * @Date: 2023-04-20 14:45:15
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
import { UserAuth } from 'db/entity';
import { setCookie } from 'utils';
import { sessionUserInfo } from '@/pages/api/user/login';

export default withIronSessionApiRoute(redirect, ironOptions);

async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session;
  const { code } = req?.query;
  const clientId = '1b76fdeefc6c5d422aac';
  const secretsKey = '361f4a6586bfeabe9023b6badf6758d9df0e69a7';
  const url = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${secretsKey}&code=${code}`;
  const response = await request.post(
    url,
    {},
    {
      headers: { accept: 'application/json' },
    }
  );
  const { access_token } = response;
  const userInfo = await request.get('https://api.github.com/user', {
    headers: {
      accept: 'application/json',
      Authorization: `token ${access_token}`,
    },
  }) as any;
  const cookie = Cookie.fromApiRoute(req, res);
  const db = await appDataSource.initialize();
  const userAuth = await db.getRepository(UserAuth).findOne({
    where: {
      identity_type: 'github',
      identifier: userInfo.id,
    },
    relations: ['user'],
  });
  if (userAuth) {
    const { user } = userAuth;
    const { id, nickname, avatar } = user;
    userAuth.credential = access_token;
    await sessionUserInfo({ user, session });
    setCookie(cookie, {
      userId: id,
      avatar,
      nickname,
    });
    res.redirect(307, '/')
  } else {
    const { id: githubId, login = '', avatar_url = '' } = userInfo;
    const user = new User();
    user.nickname = login;
    user.avatar = avatar_url;
    const userAuth = new UserAuth();
    userAuth.identity_type = 'github';
    userAuth.identifier = githubId;
    userAuth.credential = access_token;
    userAuth.user = user;
    const userAuthRepo = db.getRepository(UserAuth);
    const resUserAuth = await userAuthRepo.save(userAuth);
    const { id, nickname, avatar } = resUserAuth.user;
    await sessionUserInfo({ user, session });
    setCookie(cookie, {
      userId: id,
      avatar,
      nickname,
    });
    res.redirect(307, '/')
  }
}
