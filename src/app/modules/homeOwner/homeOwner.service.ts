/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { User } from '../user/user.model';
import { homeOwnerSearchableFields } from './homeOwner.constant';
import { IHomeOwner, IhomeOwnerFilters } from './homeOwner.interface';
import { HomeOwner } from './homeOwner.model';

const getAllHomeOwners = async (
  filters: IhomeOwnerFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IHomeOwner[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: homeOwnerSearchableFields.map(field => ({
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

  const result = await HomeOwner.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await HomeOwner.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleHomeOwner = async (id: string): Promise<IHomeOwner | null> => {
  const result = await HomeOwner.findOne({ id });
  return result;
};

const updateHomeOwner = async (
  id: string,
  payload: Partial<IHomeOwner>
): Promise<IHomeOwner | null> => {
  const isExist = await HomeOwner.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'HomeOwner not found !');
  }

  const { name, ...HomeOwnerData } = payload;

  const updatedHomeOwnerData: Partial<IHomeOwner> = { ...HomeOwnerData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IHomeOwner>; // `name.fisrtName`
      (updatedHomeOwnerData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  // if (guardian && Object.keys(guardian).length > 0) {
  //   Object.keys(guardian).forEach(key => {
  //     const guardianKey = `guardian.${key}` as keyof Partial<IHomeOwner>; // `guardian.fisrtguardian`
  //     (updatedHomeOwnerData as any)[guardianKey] =
  //       guardian[key as keyof typeof guardian];
  //   });
  // }
  // if (localGuardian && Object.keys(localGuardian).length > 0) {
  //   Object.keys(localGuardian).forEach(key => {
  //     const localGuradianKey =
  //       `localGuardian.${key}` as keyof Partial<IHomeOwner>; // `localGuardian.fisrtName`
  //     (updatedHomeOwnerData as any)[localGuradianKey] =
  //       localGuardian[key as keyof typeof localGuardian];
  //   });
  // }

  const result = await HomeOwner.findOneAndUpdate(
    { id },
    updatedHomeOwnerData,
    {
      new: true,
    }
  );
  return result;
};

// const deleteHomeOwner = async (id: string): Promise<IHomeOwner | null> => {

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {

//     // check if the HomeOwner is exist
//     const isExist = await HomeOwner.findOne({ id });

//     if (!isExist) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'HomeOwner not found !');
//     }

//     //delete HomeOwner first
//     const homeOwner = await HomeOwner.findOneAndDelete({ id }, { session });
//     if (!homeOwner) {
//       throw new ApiError(httpStatus.OK, 'Failed to delete HomeOwner');
//     }
//     //delete user
//     await User.deleteOne({ id });
//     session.commitTransaction();
//     session.endSession();
//     return homeOwner;
//   } catch (error) {
//     session.abortTransaction();
//     throw error;
//   }
// };

const deleteHomeOwner = async (id: string): Promise<IHomeOwner | null> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // check if the HomeOwner exists
    const isExist = await HomeOwner.findOne({ id });

    if (!isExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'HomeOwner not found!');
    }

    // delete HomeOwner first
    const homeOwner = await HomeOwner.findOneAndDelete({ id }, { session });
    if (!homeOwner) {
      throw new ApiError(httpStatus.OK, 'Failed to delete HomeOwner');
    }

    // delete user
    await User.deleteOne({ id });

    // Commit the transaction after all operations are successful
    await session.commitTransaction();
    return homeOwner;
  } catch (error) {
    // If there is an error, abort the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    // Finally, end the session
    session.endSession();
  }
};

export const HomeOwnerService = {
  getAllHomeOwners,
  getSingleHomeOwner,
  updateHomeOwner,
  deleteHomeOwner,
};
