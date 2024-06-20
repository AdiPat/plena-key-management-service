interface AccessKeyDetails {
  accessKey: string;
  limit: number;
  interval?: number; // default is 60
  disabled: boolean;
  expiry: Date;
}

export { AccessKeyDetails };
