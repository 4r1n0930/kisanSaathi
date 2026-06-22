import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET?.trim();
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in environment configuration');
}

export const jwtConfig = {
  secret: JWT_SECRET,
  expiresIn: '7d',
};
