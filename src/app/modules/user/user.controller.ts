import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import { UserService } from './user.service';

const createRentUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // console.log(req.cookies, 'cookies');
    const { rentUser, ...userData } = req.body;
    const result = await UserService.createRentUser(rentUser, userData);
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully!',
      data: result,
    });
  }
);

const createHomeOwner: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { homeOwner, ...userData } = req.body;
    const result = await UserService.createHomeOwner(homeOwner, userData);
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully!',
      data: result,
    });
  }
);

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { admin, ...userData } = req.body;
    const result = await UserService.createAdmin(admin, userData);
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully!',
      data: result,
    });
  }
);

export const UserController = {
  createRentUser,
  createHomeOwner,
  createAdmin,
};
