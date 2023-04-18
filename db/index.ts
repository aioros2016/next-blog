/*
 * @Author: lizhigang
 * @Date: 2023-04-17 14:49:59
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as process from 'process';
import { User, UserAuth } from './entity';

const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

export const appDataSource = new DataSource({
  type: 'mysql',
  host,
  port,
  username,
  password,
  database,
  entities: [User, UserAuth],
  synchronize: false,
  logging: true,
});
