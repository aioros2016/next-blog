/*
 * @Author: lizhigang
 * @Date: 2023-04-16 14:56:01
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import md5 from 'md5';
import { encode } from 'js-base64';
import request from 'service/base';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { Isession } from 'index';
async function fetchCaptcha(req: NextApiRequest, res: NextApiResponse) {
  const appId = '2c94811c870df4c8018788a1d3b31367';
  const accountId = '2c94811c870df4c8018788a1d2bc1360';
  const authToken = 'e61daecd5c0e426bb8ced10007154093';
  const time = dayjs().format('YYYYMMDDHHmmss');
  const sigParameter = md5(accountId + authToken + time);
  const authorization = encode(`${accountId}:${time}`);
  const captcha = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const expireMin = 5;
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${accountId}/SMS/TemplateSMS?sig=${sigParameter}`;
  const { session, body } = req;
  const { to, templateId } = body;
  console.log(captcha)
  const { statusCode, statusMsg, templateSMS } = await request.post(
    url,
    {
      to,
      templateId,
      appId,
      datas: [captcha, expireMin],
    },
    {
      headers: {
        Authorization: authorization,
      },
    }
  );
  if (statusCode === '000000') {
    (session as Isession).captcha = captcha;
    await session.save();
    res.status(200).json({
      code: 0,
      msg: 'success',
      data: {
        templateSMS
      }
    });
  } else {
    res.status(200).json({
      code: statusCode,
      msg: statusMsg,
    });
  }
}

export default withIronSessionApiRoute(fetchCaptcha, ironOptions);
