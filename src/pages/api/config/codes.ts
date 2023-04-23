/*
 * @Author: lizhigang
 * @Date: 2023-04-21 14:18:52
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
export const EXCEPTION_USER = {};

export const EXCEPTION_ARTICLE = {
  PUBLISH_FAILED: {
    code: 2001,
    msg: '发布文章失败',
  },
  UPDATE_FAILED: {
    code: 2002,
    msg: '更新文章失败',
  },
  NOT_FOUND: {
    code: 2002,
    msg: '未找到文章',
  },
};

export const EXCEPTION_COMMENT = {
  PUBLISH_FAILED: {
    code: 4001,
    msg: '发表评论失败',
  },
  NOT_FOUND: {
    code: 4002,
    msg: '未找到评论',
  },
};
