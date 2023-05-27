import type { Model } from 'mongoose';

export interface IAdmin {
  name: string;
  email: string;
  password: string;
  token: string;
}

export interface IAdminMethods {
  encryptPassword: (password: string) => Promise<void>;
  comparePassword: (password: string) => Promise<boolean>;
  generateAuthToken: () => Promise<string>;
  verifyAuthToken: (token: string) => Promise<boolean>;
}

export type TAdminModel = Model<IAdmin, {}, IAdminMethods>;
