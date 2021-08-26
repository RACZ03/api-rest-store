import { Router } from 'express';

import * as favoriteCtrl from '../controllers/favorite.controller';
import { authJwt } from '../middlewares';

const router = Router();
 
router.get('/', authJwt.verifyToken, favoriteCtrl.index );
router.post('/', authJwt.verifyToken, favoriteCtrl.store );
router.delete('/:id', authJwt.verifyToken, favoriteCtrl.destroy );

export default router;