/* eslint-disable  @typescript-eslint/explicit-module-boundary-types  */
import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
      // throw new ApiError(1000, "ore baba")
    }
  };
};

export default catchAsync;
