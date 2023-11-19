import type { Request } from 'express';
import type { EmptyObject } from 'src/helpers/types';
import { z } from 'zod';

export const registerPublicKeySchema = z.object({
  body: z.object({
    publicKey: z.string().trim(),
  }),
});

type RegisterPublicKey = z.infer<typeof registerPublicKeySchema>;

export type RegisterPublicKeyRequest = Request<
  EmptyObject,
  EmptyObject,
  RegisterPublicKey['body'] & { serverId: string }
>;
