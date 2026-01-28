import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET){
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const validatedSecret: string = JWT_SECRET;

export const jwtConfig = {
    secret: validatedSecret,
    expiresIn: '7d',
} as const;

export interface TokenPayload{
    userId: string;
    email: string;
    role: string;
    companyId: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: jwtConfig.expiresIn,
  };

  return jwt.sign(payload, jwtConfig.secret, options);
};

export const verifyToken = (token: string): TokenPayload =>{
  return jwt.verify(token, jwtConfig.secret) as TokenPayload;
};