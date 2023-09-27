import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { HomeInfoController } from './homeInfo.Controller';

const router = express.Router();

// router.get(
//   '/:id',
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   AdminController.getSingleAdmin
// );
// router.get('/', AdminController.getAllAdmins);
// router.patch(
//   '/:id',
//   validateRequest(AdminValidation.updateAdmin),
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   AdminController.updateAdmin
// );
// router.delete(
//   '/:id',
//   auth(ENUM_USER_ROLE.SUPER_ADMIN),
//   AdminController.deleteAdmin
// );

router.post(
  '/',
  auth(ENUM_USER_ROLE.HOMEOWNER),
  HomeInfoController.insertInToHomeInfo
);
router.get('/', HomeInfoController.getAllHomeInfo);

export const HomeInfoRoutes = router;
