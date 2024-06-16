import { addYears } from 'date-fns';
import jwt from 'jsonwebtoken';
import { JwtClaims } from 'src/models';

const Constants = {
  DEFAULT_ACCESS_KEY_EXPIRY: addYears(new Date(), 1),
};

function extractClaims(token: string): JwtClaims {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SIGNING_KEY);
    return decoded as JwtClaims;
  } catch (err) {
    console.error('Failed to verify token', err);
    return null;
  }
}

export { extractClaims, Constants };
