import type { Request } from 'express';
import type { EmptyObject } from 'src/helpers/types';

export type GetTaxesRequest = Request<EmptyObject, EmptyObject, EmptyObject, { userId: string }>;
