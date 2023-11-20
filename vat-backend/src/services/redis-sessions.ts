import { JWT_EXPIRY } from 'src/helpers/constants';
import { client } from 'src/redis';

export const addSession = async (userId: string, token: string): Promise<void> => {
  await client.set(userId, token, {
    EX: JWT_EXPIRY,
  });
};

export const checkSession = async (userId: string): Promise<boolean> => {
  const result = await client.get(userId);

  return Boolean(result);
};

export const getSession = async (userId: string): Promise<string | null> => {
  const result = await client.get(userId);

  return result;
};

export const removeSession = async (userId: string): Promise<void> => {
  await client.del(userId);
};
