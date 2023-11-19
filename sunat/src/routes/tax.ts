import { Router } from 'express';
import { validateRS256Jwt } from 'src/middlewares/validate-jwt';

import TaxController from '../controllers/tax';

const router = Router();

router.get('/get-taxes/:serverId', validateRS256Jwt, TaxController.getTaxes);

router.post('/generate-taxes', TaxController.generateTaxes);

export default router;
