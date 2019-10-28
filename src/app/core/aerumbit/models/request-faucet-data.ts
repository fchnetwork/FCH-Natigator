export enum Status {
  Failed = 0,
  Successful = 1
}

export interface RequestFaucetTokenData {
  status: Status;
  token: string;
}

export interface RequestFaucetData {
  status: Status;
  requested: boolean;
}