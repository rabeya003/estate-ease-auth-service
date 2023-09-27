import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../../config/index';
import ApiError from '../../../errors/ApiError';
import { Admin } from '../admin/admin.model';
import { HomeOwner } from '../homeOwner/homeOwner.model';
import { IRentUser } from '../rentUser/rentUser.interface';
import { RentUser } from '../rentUser/rentUser.model';
import { IUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateHomeOwnerId,
  generateRentUserId,
} from './user.utils';

const createRentUser = async (
  rentUser: IRentUser,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_rentuser_pass as string;
  }

  // set role
  user.role = 'RentUser';

  // generate student id
  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const id = await generateRentUserId();
    user.id = id;
    rentUser.id = id;
    console.log('===>', id);
    //array
    const newRentUser = await RentUser.create([rentUser], { session });

    if (!newRentUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }
    console.log('---->', newRentUser);
    //set student -->  _id into user.student
    user.rentUser = newRentUser[0]._id;

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate(
      'rentUser'
    );
  }

  return newUserAllData;
};

const createHomeOwner = async (
  homeOwner: IUser,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_homeuwner_pass as string;
  }

  // set role
  user.role = 'HomeOwner';

  // generate HomeOwner id
  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const id = await generateHomeOwnerId();

    user.id = id;
    homeOwner.id = id;

    const newHomeOwner = await HomeOwner.create([homeOwner], { session });

    if (!newHomeOwner.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create HomeOwner ');
    }

    user.homeOwner = newHomeOwner[0]._id;

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create HomeOwner');
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  // if (newUserAllData) {
  //   newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
  //     path: 'HomeOwner',
  //     populate: [
  //       {
  //         path: 'academicDepartment',
  //       },
  //       {
  //         path: 'academicHomeOwner',
  //       },
  //     ],
  //   });
  // }
  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate(
      'homeOwner'
    );
  }

  return newUserAllData;
};

const createAdmin = async (
  admin: IUser,
  user: IUser
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_admin_pass as string;
  }

  // set role
  user.role = 'Admin';

  // generate Admin id
  let newUserAllData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const id = await generateAdminId();

    user.id = id;
    admin.id = id;

    const newAdmin = await Admin.create([admin], { session });

    if (!newAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Admin ');
    }

    user.admin = newAdmin[0]._id;

    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate(
      'admin'
    );
  }

  return newUserAllData;
};

export const UserService = {
  createRentUser,
  createHomeOwner,
  createAdmin,
};
