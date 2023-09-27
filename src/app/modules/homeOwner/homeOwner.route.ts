import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { HomeOwnerController } from './homeOwner.controller';
import { HomeOwnerValidation } from './homeOwner.validation';

const router = express.Router();

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.HOMEOWNER),
  HomeOwnerController.getSingleHomeOwner
);
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.HOMEOWNER),
  HomeOwnerController.getAllHomeOwners
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.HOMEOWNER),
  HomeOwnerController.deleteHomeOwner
);
router.patch(
  '/:id',
  validateRequest(HomeOwnerValidation.updateHomeOwnerZodSchema),
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.HOMEOWNER),
  HomeOwnerController.updateHomeOwner
);

export const HomeOwnerRoutes = router;
