import { users } from '@prisma/client';

// _____________  User Types  _____________
export type TUserRegisterWrite = Omit<users, 'created_at' | 'updated_at' | 'last_login_at'>;
export type TloginRead = Omit<users, 'created_at' | 'updated_at' | 'last_login_at'>;
export type TloginRequest = Omit<users, 'created_at' | 'updated_at' | 'last_login_at' | 'password'>;
