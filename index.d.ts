import { IronSession } from 'iron-session';
import { Record } from 'immutable';

export type Isession = IronSession & Record<string, any>;
