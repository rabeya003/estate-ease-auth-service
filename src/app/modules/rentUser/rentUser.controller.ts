import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { RentUserFilterableFields } from './rentUser.constant';
import { IRentUser } from './rentUser.interface';
import { RentUserService } from './rentUser.service';

const getAllRentUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, RentUserFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await RentUserService.getAllRentUsers(
    filters,
    paginationOptions
  );

  sendResponse<IRentUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'RentUsers retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleRentUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await RentUserService.getSingleRentUser(id);
  sendResponse<IRentUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'RentUser retrieved successfully !',
    data: result,
  });
});

const updateRentUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await RentUserService.updateRentUser(id, updatedData);

  sendResponse<IRentUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'RentUser updated successfully !',
    data: result,
  });
});
const deleteRentUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await RentUserService.deleteRentUser(id);

  sendResponse<IRentUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'RentUser deleted successfully !',
    data: result,
  });
});

export const RentUserController = {
  getAllRentUsers,
  getSingleRentUser,
  updateRentUser,
  deleteRentUser,
};
