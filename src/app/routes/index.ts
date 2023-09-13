import express from 'express';
import { AdminRoutes } from '../modules/admin/admin.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { HomeInfoRoutes } from '../modules/homeInfo/homeInfo.route';
import { HomeOwnerRoutes } from '../modules/homeOwner/homeOwner.route';
import { RentUserRoutes } from '../modules/rentUser/rentUser.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();
const moduleRutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/rent-users',
    route: RentUserRoutes,
  },
  {
    path: '/home-owner',
    route: HomeOwnerRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/home-info',
    route: HomeInfoRoutes,
  },
];
moduleRutes.forEach(route => router.use(route.path, route.route));
export default router;
