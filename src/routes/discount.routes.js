import { Router } from 'express';

import * as discountCtrl from '../controllers/discount.controller';
import { authJwt } from '../middlewares';

const router = Router();
 
router.post('/store',[ authJwt.verifyToken, authJwt.isAdminOrModerator ], discountCtrl.store );
router.get('/', [ authJwt.verifyToken, authJwt.isAdminOrModerator ], discountCtrl.index );
router.get('/:code', [ authJwt.verifyToken, authJwt.isAdminOrModerator ], discountCtrl.show );
router.put('/:id', authJwt.verifyToken, discountCtrl.updated ); 
router.delete('/:id', authJwt.verifyToken, discountCtrl.destroy );

export default router;