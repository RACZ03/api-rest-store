import { Router } from 'express';

import * as subCategoryCtrl from '../controllers/subCategory.controller';
import { authJwt } from '../middlewares';

const router = Router();
 
router.post('/',[ authJwt.verifyToken, authJwt.isAdminOrModerator ], subCategoryCtrl.store );
router.get('/', subCategoryCtrl.index );
router.get('/:id', subCategoryCtrl.show );
router.put('/:id', subCategoryCtrl.update );
router.delete('/:id', subCategoryCtrl.destroy );

export default router;