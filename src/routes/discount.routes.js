import { Router } from 'express';

import * as discountCtrl from '../controllers/discount.controller';
import { authJwt } from '../middlewares';

const router = Router();
 
router.post('/store',[ authJwt.verifyToken, authJwt.isAdminOrModerator ], discountCtrl.store );

export default router;