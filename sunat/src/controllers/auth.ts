import type { Response } from 'express';
import type { LoginRequest } from 'src/dtos/auth/login';
import type { RegisterPublicKeyRequest } from 'src/dtos/auth/register-public-key';
import type { SignupRequest } from 'src/dtos/auth/signup';
import { generateJwt } from 'src/helpers/utils';
import { logger } from 'src/logger';
import ServerModel from 'src/models/server';

class AuthController {
  static async login(req: LoginRequest, res: Response): Promise<void> {
    const { name, password } = req.body;

    const server = await ServerModel.findByName(name);

    if (!server) {
      res.status(401).json({ message: 'Invalid name or password' });
      return;
    }

    const isPasswordValid = await ServerModel.comparePassword({
      input: password,
      hash: server.password,
    });

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid name or password' });
      return;
    }

    res.json({ name, token: generateJwt({ serverId: server._id }) });
  }

  static async signup(req: SignupRequest, res: Response): Promise<void> {
    const { name, password } = req.body;

    try {
      const hashedPassword = await ServerModel.hashPassword(password);

      await ServerModel.create({ name, password: hashedPassword });

      res.json({ ok: true });
    } catch (err) {
      logger.error(err);

      res.json({ ok: false });
    }
  }

  static async registerPublickey(req: RegisterPublicKeyRequest, res: Response): Promise<void> {
    const { serverId, publicKey } = req.body;
    logger.info({ serverId, publicKey });

    try {
      await ServerModel.updatePublicKey({ _id: serverId, publicKey });

      res.json({ ok: true });
    } catch (err) {
      logger.error(err);

      res.json({ ok: false });
    }
  }
}

export default AuthController;
