/*
 * @Author: lizhigang
 * @Date: 2023-04-17 15:26:48
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from "./user";

@Entity({ name: 'user_auth' })
export class UserAuth extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;
  @Column()
  identity_type!: string;
  @Column()
  identifier!: string;
  @Column()
  credential!: string;
  @ManyToOne(() => User, {
    cascade: true
  })
  @JoinColumn({ name: "user_id" })
  user!: User
}
