import jwt from 'jsonwebtoken';
import { JwtClaims } from 'src/models';

function extractClaims(token: string, secret: string): JwtClaims {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded as JwtClaims;
  } catch (err) {
    console.error('Failed to verify token', err);
    return null;
  }
}

export { extractClaims };
