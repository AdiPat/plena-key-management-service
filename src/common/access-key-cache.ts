import { AccessKeyDetails } from '../models';
import { redis } from '.';

class AccessKeyCache_ {
  async setAccessKeyDetails(
    accessKeyDetails: AccessKeyDetails,
  ): Promise<boolean> {
    try {
      const json = JSON.stringify(accessKeyDetails);
      await redis.set(`accessKeyDetails:${accessKeyDetails.accessKey}`, json);
      return true;
    } catch (err) {
      console.error('Failed to set access key details', err);
      return false;
    }
  }

  async getAccessKeyDetails(accessKeyValue: string): Promise<AccessKeyDetails> {
    try {
      const json = await redis.get(`accessKeyDetails:${accessKeyValue}`);
      return JSON.parse(json);
    } catch (err) {
      console.error('Failed to get access key details', err);
      return null;
    }
  }

  async getAllAccessKeys(): Promise<AccessKeyDetails[]> {
    try {
      const keys = await redis.keys('accessKeyDetails:*');
      const accessKeys = await redis.mget(keys);
      return accessKeys.map((accessKey) => JSON.parse(accessKey));
    } catch (err) {
      console.error('Failed to get all access keys', err);
      return [];
    }
  }
}

const AccessKeyCache = new AccessKeyCache_();

export { AccessKeyCache };
