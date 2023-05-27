import type { Model } from 'mongoose';

export interface IEnumerator {
  name: string;
  email: string;
  age: string;
  cnic: string;
  mobile: string;
  address: string;
  password: string;
  enumeratorId: string;
  token: string;
}

export interface IEnumeratorMethods {
  encryptPassword: (password: string) => Promise<void>;
  comparePassword: (password: string) => Promise<boolean>;
  generateAuthToken: () => void;
  verifyAuthToken: (token: string) => Promise<boolean>;
}

export type TEnumeratorModel = Model<IEnumerator, {}, IEnumeratorMethods>;
