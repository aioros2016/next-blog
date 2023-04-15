/*
 * @Author: lizhigang
 * @Date: 2023-04-15 13:07:08
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import { rest } from 'msw';

export const handlers = [
  // Handles a GET /user request
  rest.get('/api/hello', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        username: 'admin',
      })
    );
  }),
];
