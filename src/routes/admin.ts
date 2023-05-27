import { Router } from 'express';
import { createAdmin, getAdmin } from '@controllers/admin';

const adminRouter = Router();

adminRouter.post('/sign-up', createAdmin);
adminRouter.post('/sign-in', getAdmin);

export { adminRouter };
