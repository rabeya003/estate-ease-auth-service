/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { User } from '../user/user.model';
import { RentUserSearchableFields } from './rentUser.constant';
import { IRentUser, IRentUserFilters } from './rentUser.interface';
import { RentUser } from './rentUser.model';

const getAllRentUsers = async (
  filters: IRentUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IRentUser[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: RentUserSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await RentUser.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await RentUser.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleRentUser = async (id: string): Promise<IRentUser | null> => {
  const result = await RentUser.findOne({ id });
  return result;
};

const updateRentUser = async (
  id: string,
  payload: Partial<IRentUser>
): Promise<IRentUser | null> => {
  const isExist = await RentUser.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RentUser not found !');
  }

  const { name, ...RentUserData } = payload;

  const updatedRentUserData: Partial<IRentUser> = { ...RentUserData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IRentUser>; // `name.fisrtName`
      (updatedRentUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  // if (guardian && Object.keys(guardian).length > 0) {
  //   Object.keys(guardian).forEach(key => {
  //     const guardianKey = `guardian.${key}` as keyof Partial<IRentUser>; // `guardian.fisrtguardian`
  //     (updatedRentUserData as any)[guardianKey] =
  //       guardian[key as keyof typeof guardian];
  //   });
  // }
  // if (localGuardian && Object.keys(localGuardian).length > 0) {
  //   Object.keys(localGuardian).forEach(key => {
  //     const localGuradianKey =
  //       `localGuardian.${key}` as keyof Partial<IRentUser>; // `localGuardian.fisrtName`
  //     (updatedRentUserData as any)[localGuradianKey] =
  //       localGuardian[key as keyof typeof localGuardian];
  //   });
  // }

  const result = await RentUser.findOneAndUpdate({ id }, updatedRentUserData, {
    new: true,
  });
  return result;
};

const deleteRentUser = async (id: string): Promise<IRentUser | null> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // check if the RentUser is exist
    const rentUser = await RentUser.findOne({ id });

    if (!rentUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'RentUser not found !');
    }

    // delete RentUser first
    const deletedRentUser = await RentUser.findOneAndDelete(
      { id },
      { session }
    );
    if (!deletedRentUser) {
      throw new ApiError(httpStatus.OK, 'Failed to delete RentUser');
    }

    // delete user
    await User.deleteOne({ id }, { session });

    await session.commitTransaction();
    session.endSession();

    return deletedRentUser;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const RentUserService = {
  getAllRentUsers,
  getSingleRentUser,
  updateRentUser,
  deleteRentUser,
};
