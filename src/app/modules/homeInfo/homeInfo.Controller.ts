// const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
//   const filters = pick(req.query, adminFilterableFields);
//   const paginationOptions = pick(req.query, paginationFields);
//   const result = await AdminService.getAllAdmins(filters, paginationOptions);
//   sendResponse<IAdmin[]>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Admins retrieved successfully !',
//     meta: result.meta,
//     data: result.data,
//   });
// });
// const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const result = await AdminService.getSingleAdmin(id);
//   sendResponse<IAdmin>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Admin retrieved successfully !',
//     data: result,
//   });
// });
// const updateAdmin = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const updatedData = req.body;
//   const result = await AdminService.updateAdmin(id, updatedData);
//   sendResponse<IAdmin>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Admin updated successfully !',
//     data: result,
//   });
// });
// const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const result = await AdminService.deleteAdmin(id);
//   sendResponse<IAdmin>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Admin deleted successfully !',
//     data: result,
//   });
// });

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { default as sendResponce } from '../../../shared/sendResponse';
import { HomeFilterableFields } from './homeInfo.constant';
import { IHomeInfo } from './homeInfo.interface';
import { HomeInfoService } from './homeInfo.service';

const insertInToHomeInfo = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { userId }: any = req.user;
  const { ...HomeInfoData } = req.body;
  const result = await HomeInfoService.insertInToHomeInfo(HomeInfoData, userId);
  sendResponce(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HomeInfo is created successfully !',
    data: result,
  });
});

const getAllHomeInfo = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, HomeFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await HomeInfoService.getAllHomeInfo(
    filters,
    paginationOptions
  );
  sendResponce<IHomeInfo[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HomeInfo retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

export const HomeInfoController = {
  insertInToHomeInfo,
  getAllHomeInfo,
};
