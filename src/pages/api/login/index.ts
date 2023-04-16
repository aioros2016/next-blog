/*
 * @Author: lizhigang
 * @Date: 2023-04-16 16:49:33
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';

async function Login(req: NextApiRequest, res: NextApiResponse) {
  const { phone, captcha } = req.body;
}

export default withIronSessionApiRoute(Login, ironOptions);
