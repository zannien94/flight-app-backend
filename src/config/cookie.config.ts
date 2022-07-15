enum SameSite {
  LAX = 'lax',
  NONE = 'none',
  STRICT = 'strict',
}

interface JwtCookieConfig {
  expires: Date;
  httpOnly: boolean;
  secure: boolean;
  domain?: string;
  sameSite?: SameSite | boolean;
}

export const jwtCookieConfig = (expires: Date): JwtCookieConfig => {
  const secure = process.env.NODE_ENV === 'development' ? false : true;
  return {
    expires,
    httpOnly: true,
    secure,
    sameSite: SameSite.NONE,
  };
};
