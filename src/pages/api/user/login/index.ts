/*
 * @Author: lizhigang
 * @Date: 2023-04-16 16:49:33
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { appDataSource } from 'db';
import { User, UserAuth } from 'db/entity';
import { Isession } from 'index';
import { Cookie } from 'next-cookie';
import { setCookie } from 'utils';

export async function sessionUserInfo({ user, session }) {
  if (!user) return;
  const { id, nickname, avatar } = user;
  session.id = id;
  session.nickname = nickname;
  session.avatar = avatar;
  await session.save();
}

async function Login(req: NextApiRequest, res: NextApiResponse) {
  const session: Isession = req.session;
  const cookie = Cookie.fromApiRoute(req, res);
  const { phone, captcha, identityType = 'phone' } = req.body;
  const db = await appDataSource.initialize();
  const userAuthRepo = db.getRepository(UserAuth);
  if (session.captcha.toString() === captcha) {
    const userAuth = await userAuthRepo.findOne({
      where: {
        identity_type: identityType,
        identifier: phone,
      },
      relations: ['user'],
    });
    if (userAuth) {
      const user = userAuth.user;
      const { id, nickname, avatar } = user;
      await sessionUserInfo({ user, session });
      setCookie(cookie, {
        userId: id,
        avatar,
        nickname,
      });
      res.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          ...user,
        },
      });
    } else {
      const user = new User();
      const { id, nickname, avatar } = user;
      user.nickname = `用户${Math.floor(Math.random() * 10000)}`;
      user.avatar = '/images/avatar.png';
      user.job = '暂无';
      user.introduce = '暂无';
      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identityType;
      userAuth.credential = session.captcha;
      userAuth.user = user;
      const resUserAuth = await userAuthRepo.save(userAuth);
      const { user: userInfo } = resUserAuth;
      await sessionUserInfo({ user: userInfo, session });
      setCookie(cookie, {
        userId: id,
        avatar,
        nickname,
      });
      res.status(200).json({
        code: 0,
        msg: '登录成功',
        data: { ...userInfo },
      });
    }
  } else {
    res.status(200).json({
      code: -1,
      msg: '验证码错误',
    });
  }
}

export default withIronSessionApiRoute(Login, ironOptions);
