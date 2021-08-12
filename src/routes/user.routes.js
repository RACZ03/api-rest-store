import { Router } from 'express';

import * as userCtrl from '../controllers/user.controller';
import { authJwt } from '../middlewares';
// Config multiparty module
import multiparty from 'connect-multiparty';
const md_upload = multiparty({ uploadDir: './src/uploads/users'});

const router = Router();

router.get('/', [ authJwt.verifyToken, authJwt.isAdminOrModerator ], userCtrl.index );
router.get('/:id', [ authJwt.verifyToken, authJwt.isAdminOrModerator ], userCtrl.show );
router.put('/:id', authJwt.verifyToken, userCtrl.updated ); 
router.delete('/:id', [ authJwt.verifyToken, authJwt.isAdminOrModerator ], userCtrl.destroy );

router.post('/uploadImage', md_upload, userCtrl.uploadImage ); 
router.get('/avatar/:filename', userCtrl.getAvatar );

export default router;