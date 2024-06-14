import dotenv from 'dotenv';
import { generateJWT } from '.';

dotenv.config();

const token = generateJWT();

console.log('Generated JWT: ', token);

export { generateJWT };
