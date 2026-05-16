import jwt from 'jsonwebtoken';

export function createToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET || 'development_secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
  );
}
