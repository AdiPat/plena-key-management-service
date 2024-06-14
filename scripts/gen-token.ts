import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

function generateJWT(): string {
  const payload = {
    data: {
      userId: uuid(),
    },
  };

  const secret = process.env.JWT_SIGNING_KEY;

  const options = {
    expiresIn: '1h',
  };

  const token = jwt.sign(payload, secret, options);

  return token;
}

const token = generateJWT();

console.log('Generated JWT: ', token);
