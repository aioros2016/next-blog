import { IronSession } from 'iron-session';
import { Record } from 'immutable';

export type Isession = IronSession & Record<string, any>;

export interface Comment {
  id: number;
  content: string;
  user: User;
  create_time: Date;
  update_time: Date;
}

export interface User {
  id: number;
  avatar: string;
  nickname: string;
  job?: string;
  introduce?: string;
}

export interface Articles {
  id: number;
  title: string;
  content: string;
  views: number;
  is_delete: boolean;
  create_time: string;
  update_time: string;
  user: User;
  comments: Comment[];
}

export interface Tag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users: User[];
}
