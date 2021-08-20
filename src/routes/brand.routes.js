import { Router } from 'express';

import * as brandCtrl from '../controllers/brand.controller';
import { authJwt } from '../middlewares';

const router = Router();
 
router.post('/',[ authJwt.verifyToken, authJwt.isAdminOrModerator ], brandCtrl.store );
router.get('/', brandCtrl.index );
router.get('/:id', brandCtrl.show );
router.put('/:id', [ authJwt.verifyToken, authJwt.isAdminOrModerator ], brandCtrl.update );
router.delete('/:id', [ authJwt.verifyToken, authJwt.isAdminOrModerator ], brandCtrl.destroy );

export default router;