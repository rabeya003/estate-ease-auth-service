import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.post('/create-rentUser', UserController.createRentUser);

router.post('/create-homeOwner', UserController.createHomeOwner);

router.post('/create-admin', UserController.createAdmin);

export const UserRoutes = router;
