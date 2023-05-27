import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CONSTANTS } from '@config/constants';
import {
  IEnumerator,
  IEnumeratorMethods,
  TEnumeratorModel,
} from '@interfaces/enumerator';

const enumeratorSchema = new Schema<
  IEnumerator,
  IEnumeratorMethods,
  TEnumeratorModel
>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
      unique: true,
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    age: {
      type: String,
      trim: true,
    },
    enumeratorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

enumeratorSchema.methods.encryptPassword = async function (password: string) {
  const enumerator = this;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  enumerator.password = hash;
  await enumerator.save();
};

enumeratorSchema.methods.comparePassword = async function (password: string) {
  const enumerator = this;
  enumerator.save();
  const isMatch = await bcrypt.compare(password, enumerator.password);
  return isMatch;
};

enumeratorSchema.methods.generateAuthToken = async function () {
  const enumerator = this;
  const token = jwt.sign({ _id: enumerator._id }, CONSTANTS.JWT_KEY as string);
  enumerator.token = token;
  await enumerator.save();
};

enumeratorSchema.methods.verifyAuthToken = async function (token: string) {
  const enumerator = this;

  const decoded = jwt.verify(token, CONSTANTS.JWT_KEY as string);
  const { _id } = decoded as { _id: string };
  if (_id === enumerator._id.toString()) {
    return true;
  }
  return false;
};

export const EnumeratorModel = model<IEnumerator, TEnumeratorModel>(
  'enumerator',
  enumeratorSchema
);
