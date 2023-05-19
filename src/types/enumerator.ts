import type { Model } from 'mongoose';

export interface IEnumerator {
  name: string;
  email: string;
  password: string;
  phone: string;
  cnic: string;
  address: string;
  token: string;
}

export interface IEnumeratorMethods {
  encryptPassword: (password: string) => Promise<void>;
  comparePassword: (password: string) => Promise<boolean>;
  generateAuthToken: () => Promise<string>;
  verifyAuthToken: (token: string) => Promise<boolean>;
}

export type TEnumeratorModel = Model<IEnumerator, {}, IEnumeratorMethods>;
