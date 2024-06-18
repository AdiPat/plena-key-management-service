interface AccessKeyDetails {
  accessKey: string;
  limitPerSecond: number;
  disabled: boolean;
  expiry: Date;
}

export { AccessKeyDetails };
