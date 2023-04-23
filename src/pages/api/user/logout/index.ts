/*
 * @Author: lizhigang
 * @Date: 2023-04-20 13:33:11
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { Cookie } from 'next-cookie';
import { clearCookie } from 'utils';

export default withIronSessionApiRoute(logout, ironOptions);

async function logout(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session;
  const cookie = Cookie.fromApiRoute(req, res);

  await session.destroy();
  clearCookie(cookie);
  cookie.set('userId', '');
  cookie.set('avatar', '');
  cookie.set('nickname', '');

  res.status(200).json({
    code: 0,
    msg: '账号登出成功',
    data: null,
  });
}
