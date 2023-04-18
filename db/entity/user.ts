/*
 * @Author: lizhigang
 * @Date: 2023-04-17 15:15:36
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;
  @Column()
  nickname!: string;
  @Column()
  avatar!: string;
  @Column()
  job!: string;
  @Column()
  introduce!: string;
}
