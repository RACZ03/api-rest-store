import { Router } from 'express';

import * as subCategoryCtrl from '../controllers/subCategory.controller';
import { authJwt } from '../middlewares';

const router = Router();
 
router.post('/',[ authJwt.verifyToken, authJwt.isAdminOrModerator ], subCategoryCtrl.store );
router.get('/', subCategoryCtrl.index );

export default router;