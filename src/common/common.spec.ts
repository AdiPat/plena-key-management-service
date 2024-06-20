import { Test, TestingModule } from '@nestjs/testing';
import { generateRandomKey, extractClaims } from '.';
import { generateJWT } from '../../scripts/gen-token';

describe('common', () => {
  describe('generateRandomKey()', () => {
    it('should generate a random key"', () => {
      expect(generateRandomKey()).toBeTruthy();
    });
  });

  describe('extractClaims()', () => {
    it('should extract claims from a JWT"', async () => {
      const token = generateJWT();

      const claims = await extractClaims(token);

      expect(claims.data).toBeTruthy();
      expect(claims.data).toHaveProperty('userId');
    });
  });
});
