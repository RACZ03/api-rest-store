import { Router } from 'express';

import * as userCtrl from '../controllers/user.controller';
import { authJwt } from '../middlewares';

const router = Router();

router.get('/', [ authJwt.verifyToken, authJwt.isAdminOrModerator ], userCtrl.index );

export default router;