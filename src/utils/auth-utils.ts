import { createHmac } from 'crypto';

export const hashToken = (token: string): string =>
  createHmac('sha512', process.env.SECRET_HMAC).update(token).digest('hex');
