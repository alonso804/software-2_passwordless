import { Router } from 'express';
import { loginSchema } from 'src/dtos/auth/login';
import { registerPublicKeySchema } from 'src/dtos/auth/register-public-key';
import { signupSchema } from 'src/dtos/auth/signup';
import { validateJwt } from 'src/middlewares/validate-jwt';
import { validateSchema } from 'src/middlewares/validate-schema';

import AuthController from '../controllers/auth';

const router = Router();

router.post('/signup', validateSchema(signupSchema), AuthController.signup);

router.post('/login', validateSchema(loginSchema), AuthController.login);

router.post(
  '/register-public-key',
  validateSchema(registerPublicKeySchema),
  validateJwt,
  AuthController.registerPublickey,
);

export default router;
