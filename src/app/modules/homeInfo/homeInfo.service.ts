/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { User } from '../user/user.model';
import { IHomeFilters, IHomeInfo } from './homeInfo.interface';
import { HomeInfo } from './homeInfo.model';

// const getSingleAdmin = async (id: string): Promise<IAdmin | null> => {
//   const result = await Admin.findOne({ id });
//   return result;
// };

// const getAllAdmins = async (
//   filters: IAdminFilters,
//   paginationOptions: IPaginationOptions
// ): Promise<IGenericResponse<IAdmin[]>> => {
//   // Extract searchTerm to implement search query
//   const { searchTerm, ...filtersData } = filters;
//   const { page, limit, skip, sortBy, sortOrder } =
//     paginationHelpers.calculatePagination(paginationOptions);

//   const andConditions = [];

//   // Search needs $or for searching in specified fields
//   if (searchTerm) {
//     andConditions.push({
//       $or: adminSearchableFields.map(field => ({
//         [field]: {
//           $regex: searchTerm,
//           $options: 'i',
//         },
//       })),
//     });
//   }

//   // Filters needs $and to fullfill all the conditions
//   if (Object.keys(filtersData).length) {
//     andConditions.push({
//       $and: Object.entries(filtersData).map(([field, value]) => ({
//         [field]: value,
//       })),
//     });
//   }

//   // Dynamic sort needs  fields to  do sorting
//   const sortConditions: { [key: string]: SortOrder } = {};
//   if (sortBy && sortOrder) {
//     sortConditions[sortBy] = sortOrder;
//   }

//   // If there is no condition , put {} to give all data
//   const whereConditions =
//     andConditions.length > 0 ? { $and: andConditions } : {};

//   const result = await Admin.find(whereConditions)
//     // .populate('managementDepartment')
//     .sort(sortConditions)
//     .skip(skip)
//     .limit(limit);

//   const total = await Admin.countDocuments(whereConditions);

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };

// const updateAdmin = async (
//   id: string,
//   payload: Partial<IAdmin>
// ): Promise<IAdmin | null> => {
//   const isExist = await Admin.findOne({ id });

//   if (!isExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found !');
//   }

//   const { name, ...adminData } = payload;

//   const updatedStudentData: Partial<IAdmin> = { ...adminData };

//   if (name && Object.keys(name).length > 0) {
//     Object.keys(name).forEach(key => {
//       const nameKey = `name.${key}` as keyof Partial<IAdmin>;
//       (updatedStudentData as any)[nameKey] = name[key as keyof typeof name];
//     });
//   }

//   const result = await Admin.findOneAndUpdate({ id }, updatedStudentData, {
//     new: true,
//   });
//   return result;
// };

// const deleteAdmin = async (id: string): Promise<IAdmin | null> => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // check if the Admin exists
//     const isExist = await Admin.findOne({ id });

//     if (!isExist) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found!');
//     }

//     // delete Admin first
//     const admin = await Admin.findOneAndDelete({ id }, { session });
//     if (!admin) {
//       throw new ApiError(404, 'Failed to delete Admin');
//     }

//     // delete user
//     await User.deleteOne({ id }, { session });

//     // Commit the transaction after all operations are successful
//     await session.commitTransaction();
//     return admin;
//   } catch (error) {
//     // If there is an error, abort the transaction
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     // Finally, end the session
//     session.endSession();
//   }
// };

// const insertInToHomeInfo = async (
//   rentUser: IRentUser,
//   user: IUser
// ): Promise<IUser | null> => {
//   // default password
//   if (!user.password) {
//     user.password = config.default_rentuser_pass as string;
//   }

//   // set role
//   user.role = 'RentUser';

//   // generate student id
//   let newUserAllData = null;
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     const id = await generateRentUserId();
//     user.id = id;
//     rentUser.id = id;
//     console.log('===>', id);
//     //array
//     const newRentUser = await RentUser.create([rentUser], { session });

//     if (!newRentUser.length) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student');
//     }
//     console.log('---->', newRentUser);
//     //set student -->  _id into user.student
//     user.rentUser = newRentUser[0]._id;

//     const newUser = await User.create([user], { session });

//     if (!newUser.length) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
//     }
//     newUserAllData = newUser[0];

//     await session.commitTransaction();
//     await session.endSession();
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw error;
//   }

//   if (newUserAllData) {
//     newUserAllData = await User.findOne({ id: newUserAllData.id }).populate(
//       'rentUser'
//     );
//   }

//   return newUserAllData;
// };

const insertInToHomeInfo = async (
  payload: IHomeInfo,
  userId: string
): Promise<IHomeInfo> => {
  const isUserExist = await User.findOne({ id: userId });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');
  }

  if (!isUserExist.nidVerified) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Please verify your NID first ! Contact with admin for more info.'
    );
  }

  payload.homeOwnerId = userId;
  payload.homeStatus = 'pending';
  payload.home.homeSize = payload.home.homeSizeDetails.totalSQFT
    ? payload.home.homeSizeDetails.totalSQFT
    : 0;
  payload.ownerBehaviourCommonQuestion = [
    {
      question: 'Owner behavior?',
      answers: ['Good', 'Average', 'Poor'],
    },
    {
      question: 'The owner provides the information when you rent, is it true?',
      answers: ['No', 'Yes'],
    },
    {
      question: 'Is there any electricity or gas problem?',
      answers: ['Yes', 'No'],
    },
    {
      question: 'Does the owner create problems when guests come?',
      answers: ['No', 'Yes'],
    },
  ];
  payload.homeReview = {
    rating: 0,
    review: [],
  };

  const result = await HomeInfo.create(payload);
  return result;
};

const getAllHomeInfo = async (
  filters: IHomeFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IHomeInfo[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  console.log(filtersData, searchTerm);
  const andConditions = [];

  // Search needs $or for searching in specified fields
  // if (searchTerm) {
  //   andConditions.push({
  //     $or: homeSearchableFields.map(field => ({
  //       [field]: {
  //         $regex: searchTerm,
  //         $options: 'i',
  //       },
  //     })),
  //   });
  // }

  if (searchTerm) {
    const searchableFields = [
      'home.title',
      'home.tageLine',
      'home.tages',
      'home.description',
      'home.location',
      'home.residential',
      // Add other fields you want to search here
    ];

    andConditions.push({
      $or: searchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Filters needs $and to fulfill all the conditions
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [`home.${field}`]: value,
      })),
    });
  }

  console.log(andConditions);
  // Dynamic sort needs  fields to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // If there is no condition , put {} to give all data
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await HomeInfo.find(whereConditions)
    .populate('homeOwnerId')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await HomeInfo.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// const getAllAdmins = async (
//     filters: IAdminFilters,
//     paginationOptions: IPaginationOptions
//   ): Promise<IGenericResponse<IAdmin[]>> => {
//     // Extract searchTerm to implement search query
//     const { searchTerm, ...filtersData } = filters;
//     const { page, limit, skip, sortBy, sortOrder } =
//       paginationHelpers.calculatePagination(paginationOptions);

//     const andConditions = [];

//     // Search needs $or for searching in specified fields
//     if (searchTerm) {
//       andConditions.push({
//         $or: adminSearchableFields.map(field => ({
//           [field]: {
//             $regex: searchTerm,
//             $options: 'i',
//           },
//         })),
//       });
//     }

//     // Filters needs $and to fullfill all the conditions
//     if (Object.keys(filtersData).length) {
//       andConditions.push({
//         $and: Object.entries(filtersData).map(([field, value]) => ({
//           [field]: value,
//         })),
//       });
//     }

//     // Dynamic sort needs  fields to  do sorting
//     const sortConditions: { [key: string]: SortOrder } = {};
//     if (sortBy && sortOrder) {
//       sortConditions[sortBy] = sortOrder;
//     }

//     // If there is no condition , put {} to give all data
//     const whereConditions =
//       andConditions.length > 0 ? { $and: andConditions } : {};

//     const result = await Admin.find(whereConditions)
//       // .populate('managementDepartment')
//       .sort(sortConditions)
//       .skip(skip)
//       .limit(limit);

//     const total = await Admin.countDocuments(whereConditions);

//     return {
//       meta: {
//         page,
//         limit,
//         total,
//       },
//       data: result,
//     };
//   };

export const HomeInfoService = {
  insertInToHomeInfo,
  getAllHomeInfo,
};
