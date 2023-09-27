import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { RentUserController } from './rentUser.controller';
import { RentUserValidation } from './student.validation';

const router = express.Router();

router.get('/:id', RentUserController.getSingleRentUser);
router.get('/', RentUserController.getAllRentUsers);
router.delete('/:id', RentUserController.deleteRentUser);
router.patch(
  '/:id',
  validateRequest(RentUserValidation.updateRentUserZodSchema),
  RentUserController.updateRentUser
);

export const RentUserRoutes = router;
