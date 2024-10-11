import { fromHex } from "viem";

export const isValidAttestationUID = (uid: string) => {
  if (!uid) return false;
  return fromHex(uid as `0x${string}`, { to: "number" }) > 0;
};
