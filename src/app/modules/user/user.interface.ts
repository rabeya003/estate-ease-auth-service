/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type IUser = {
  id: string;
  role: 'Admin' | 'RentUser' | 'HomeOwner';
  password: string;
  nidNumber: number;
  nidVerified: boolean;
  needsPasswordChange: boolean;
  admin?: Types.ObjectId;
  rentUser?: Types.ObjectId;
  homeOwner?: Types.ObjectId;
};

// export type IUserMethods = {
//   isUserExist(id: string): Promise<Partial<IUser> | null>;
//   isPasswordMatched(
//     givenPassword: string,
//     savedPassword: string
//   ): Promise<boolean>;
// };

export type UserModel = {
  isUserExist(
    id: string
  ): Promise<Pick<IUser, 'id' | 'password' | 'role' | 'needsPasswordChange'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
