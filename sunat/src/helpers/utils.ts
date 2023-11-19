import jwt from 'jsonwebtoken';
import BadRequest from 'src/errors/bad-request';
import type { AnyZodObject } from 'zod';

export const generateJwt = (payload: string | Record<string, unknown>): string => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 15 * 60,
  });
};

export const verifyJwt = (token: string): string | Record<string, unknown> => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyRS256Jwt = async (
  token: string,
  publicKey: string,
): Promise<string | Record<string, unknown>> => {
  return jwt.verify(token, publicKey, {
    algorithms: ['RS256'],
  });
};

export const validateSchema = <T>(schema: AnyZodObject, data: T): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: Record<string, string[]> = {};

    result.error.issues.forEach(({ path, message }) => {
      const key = path.join('.');

      if (!errors[key]) {
        errors[key] = [];
      }

      errors[key].push(message);
    });

    throw new BadRequest(errors);
  }

  return result.data as T;
};

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getRandomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};
