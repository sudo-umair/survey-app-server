import { Router } from 'express';
import {
  createAdmin,
  getAdmin,
  deleteAdmin,
  updateAdmin,
} from '@controllers/admin';

const adminRouter = Router();

adminRouter.post('/sign-up', createAdmin);
adminRouter.post('/sign-in', getAdmin);
// adminRouter.post('/update-admin', updateAdmin);
// adminRouter.post('/delete-admin', deleteAdmin);

export { adminRouter };
