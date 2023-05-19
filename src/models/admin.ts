import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CONSTANTS } from '@config/constants';
import type { IAdmin, IAdminMethods, TAdminModel } from '@/types/admin';

const adminSchema = new Schema<IAdmin, IAdminMethods, TAdminModel>(
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
    token: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.methods.encryptPassword = async function (password: string) {
  const admin = this;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  admin.password = hash;
  await admin.save();
};

adminSchema.methods.comparePassword = async function (password: string) {
  const admin = this;
  admin.save();
  const isMatch = await bcrypt.compare(password, admin.password);
  return isMatch;
};

adminSchema.methods.generateAuthToken = async function () {
  const admin = this;
  const token = jwt.sign({ _id: admin._id }, CONSTANTS.JWT_KEY as string);
  admin.token = token;
  await admin.save();
};

adminSchema.methods.verifyAuthToken = async function (token: string) {
  const admin = this;
  const decoded = jwt.verify(token, CONSTANTS.JWT_KEY as string);
  const { _id } = decoded as { _id: string };
  if (_id === admin._id.toString()) {
    return true;
  }
  return false;
};

export const AdminModel = model<IAdmin, TAdminModel>('admin', adminSchema);
