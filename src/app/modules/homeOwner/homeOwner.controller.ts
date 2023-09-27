import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { homeOwnerFilterableFields } from './homeOwner.constant';
import { IHomeOwner } from './homeOwner.interface';
import { HomeOwnerService } from './homeOwner.service';
const getAllHomeOwners = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, homeOwnerFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await HomeOwnerService.getAllHomeOwners(
    filters,
    paginationOptions
  );

  sendResponse<IHomeOwner[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HomeOwners retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleHomeOwner = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await HomeOwnerService.getSingleHomeOwner(id);
  sendResponse<IHomeOwner>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HomeOwner retrieved successfully !',
    data: result,
  });
});

const updateHomeOwner = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await HomeOwnerService.updateHomeOwner(id, updatedData);

  sendResponse<IHomeOwner>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HomeOwner updated successfully !',
    data: result,
  });
});
const deleteHomeOwner = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await HomeOwnerService.deleteHomeOwner(id);

  sendResponse<IHomeOwner>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HomeOwner deleted successfully !',
    data: result,
  });
});

export const HomeOwnerController = {
  getAllHomeOwners,
  getSingleHomeOwner,
  updateHomeOwner,
  deleteHomeOwner,
};
