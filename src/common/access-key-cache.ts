import { AccessKeyDetails } from 'src/models';
import { redis } from '.';

class AccessKeyCache_ {
  async setAccessKeyDetails(
    accessKeyDetails: AccessKeyDetails,
  ): Promise<boolean> {
    try {
      const json = JSON.stringify(accessKeyDetails);
      await redis.set(accessKeyDetails.accessKey, json);
      return true;
    } catch (err) {
      console.error('Failed to set access key details', err);
      return false;
    }
  }

  async getAccessKeyDetails(accessKey: string): Promise<AccessKeyDetails> {
    try {
      const json = await redis.get(accessKey);
      return JSON.parse(json);
    } catch (err) {
      console.error('Failed to get access key details', err);
      return null;
    }
  }
}

const AccessKeyCache = new AccessKeyCache_();

export { AccessKeyCache };
