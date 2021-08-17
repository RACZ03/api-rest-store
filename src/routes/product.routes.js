import { Router } from 'express';

import * as productCtrl from '../controllers/product.controller';
import { authJwt } from '../middlewares';
// Config multiparty module
import multiparty from 'connect-multiparty';
const md_upload = multiparty({ uploadDir: './src/uploads/products'});

const router = Router();
 
router.post('/', authJwt.verifyToken, productCtrl.store );
router.get('/', productCtrl.index );
router.get('/:id', productCtrl.show );
router.put('/:id', productCtrl.update );
router.delete('/:id', productCtrl.destroy );

router.post('/uploadImage', md_upload, productCtrl.uploadImage ); 
router.get('/image/:filename', productCtrl.getImage );

export default router;