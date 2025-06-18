import { users } from '@prisma/client';

// _____________  User Types  _____________
export type TUserRegisterWrite = Omit<users, 'created_at' | 'updated_at' | 'last_login_at'>;
export type TloginRead = Omit<users, 'created_at' | 'updated_at' | 'last_login_at'>;
export type TloginRequest = Omit<users, 'created_at' | 'updated_at' | 'last_login_at' | 'password'>;

// _____________  CashBuyers Types  _____________
export type TCashBuyerID = string;
export type TCashBuyerCreate = {
  name: string;
  address?: string;
  city?: string;
  zipcode?: string;
  state?: string;
};
export type TCashBuyerUpdate = Partial<TCashBuyerCreate>;
export type TCashBuyerRead = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  zipcode?: string;
  state?: string;
};
