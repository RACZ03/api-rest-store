import { Router } from 'express';

import * as productCtrl from '../controllers/product.controller';
import * as userCtrl from '../controllers/user.controller';
import { authJwt } from '../middlewares';
// Config multiparty module
import multiparty from 'connect-multiparty';
const md_upload = multiparty({ uploadDir: './src/uploads/products'});

const router = Router();
 
router.get('/', productCtrl.index );
router.get('/:id', productCtrl.show );
router.post('/', [ authJwt.verifyToken, authJwt.isAdminOrModerator ], productCtrl.store );
router.put('/:id', [ authJwt.verifyToken, authJwt.isAdminOrModerator ], productCtrl.update );
router.delete('/:id', [ authJwt.verifyToken, authJwt.isAdminOrModerator ], productCtrl.destroy );

/* Reuse the image upload api that is in the user controller 
 since the configuration of the path where it is stored is configured from the path */
router.post('/uploadImage', md_upload, userCtrl.uploadImage ); 

router.get('/image/:filename', productCtrl.getImage );

export default router;