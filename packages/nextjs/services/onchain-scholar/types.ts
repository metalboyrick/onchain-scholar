// Enum for Status
export enum Status {
  Idle,
  Running,
  Granted,
  Refunded,
}

// Type for Criteria
export type Criteria = {
  minGPA: bigint;
  passOrFail: boolean;
};

// Type for Goal
export type Goal = {
  name: `0x${string}`; // must be encoded
  target: bigint;
  criteria: Criteria;
  status: Status;
  sendToRecipient: bigint;
  sendToInstitution: bigint;
  backers: string[]; // `address[]` is an array of strings representing Ethereum addresses
};
