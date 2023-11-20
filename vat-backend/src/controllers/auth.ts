import axios from 'axios';
import type { Request, Response } from 'express';
import fs from 'fs/promises';
import type { LoginRequest } from 'src/dtos/auth/login';
import type { SignupRequest } from 'src/dtos/auth/signup';
import { generateJwt, verifyJwt } from 'src/helpers/utils';
import { logger } from 'src/logger';
import UserModel from 'src/models/user';
import { addSession, checkSession, getSession, removeSession } from 'src/services/redis-sessions';
import { sendMagicLinkLogin, sendSignupConfirmation } from 'src/services/send-email';

class AuthController {
  static async login(req: LoginRequest, res: Response): Promise<Response> {
    const { username } = req.body;

    const user = await UserModel.findByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    if (await checkSession(String(user._id))) {
      return res.status(200).json({ message: 'Already logged in' });
    }

    await sendMagicLinkLogin(user.email, generateJwt({ userId: user._id }));

    return res.json({ ok: true });
  }

  static async confirmLogin(req: Request, res: Response): Promise<Response> {
    const { token } = req.body as { token: string };

    if (!token) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      const decodedToken = verifyJwt(token) as { userId: string };

      const user = await UserModel.findById(decodedToken.userId).lean();

      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      if (await checkSession(String(user._id))) {
        return res.status(200).json({ message: 'Already logged in' });
      }

      await addSession(String(user._id), token);

      return res.status(200).json({ username: user.username, token: token });
    } catch (err) {
      logger.error(err);

      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  static async logout(req: Request, res: Response): Promise<Response> {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      const decodedToken = verifyJwt(token) as { userId: string };

      const user = await UserModel.findById(decodedToken.userId).lean();

      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const session = await getSession(String(user._id));

      if (!session || session !== token) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      await removeSession(String(user._id));

      return res.status(200).json({ ok: true });
    } catch (err) {
      logger.error(err);

      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  static async signup(req: SignupRequest, res: Response): Promise<Response> {
    const { username, email } = req.body;

    const user = await UserModel.findByUsername(username);

    if (!user) {
      await sendSignupConfirmation(email, generateJwt({ username, email }));

      return res.status(200).json({ ok: true });
    }

    return res.status(401).json({ message: 'Invalid username' });
  }

  static async confirmSignup(req: Request, res: Response): Promise<Response> {
    const { token } = req.body as { token: string };

    if (!token) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      const decodedToken = verifyJwt(token) as { username: string; email: string };

      const user = await UserModel.findByUsername(decodedToken.username);

      if (!user) {
        await UserModel.create({ username: decodedToken.username, email: decodedToken.email });

        return res.status(200).json({ ok: true });
      }

      return res.status(401).json({ message: 'Invalid username' });
    } catch (err) {
      logger.error(err);

      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  static async registerPublicKey(req: Request, res: Response): Promise<void> {
    const jwt = req.headers.authorization?.split(' ')[1];

    try {
      const publicKey = await fs.readFile('jwtRS256.pub', 'utf8');

      await axios.post(
        `${process.env.SUNAT_URI}/auth/register-public-key`,
        {
          publicKey,
        },
        {
          headers: {
            authorization: `Bearer ${jwt}`,
          },
        },
      );

      res.json({ ok: true });
    } catch (err) {
      logger.error(err);

      res.json({ ok: false });
    }
  }
}

export default AuthController;
