/*
 * @Author: lizhigang
 * @Date: 2023-04-21 10:52:07
 * @Company: www.smm.cn
 * @Description: 文件描述
 */
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./user";
import { Comment } from "./comment";

@Entity({ name: 'articles' })
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;
  @Column()
  title!: string;
  @Column()
  content!: string;
  @Column()
  views!: number;
  @Column()
  create_time!: Date;
  @Column()
  update_time!: Date;
  @Column()
  is_delete!: boolean;
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User
  @OneToMany(() => Comment, comment => comment.article)
  comments!: Comment[]
}
