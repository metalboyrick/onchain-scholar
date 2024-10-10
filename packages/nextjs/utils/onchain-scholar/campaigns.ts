import { fromHex } from "viem";
import { Goal } from "~~/services/onchain-scholar/types";

export const parseCampaignData = (result: any) => {
  const [
    name,
    id,
    institutionAddress,
    recipientAddress,
    goals,
    goalAttestationUIDs,
    goalBalances,
    admissionAttestation,
    isAdmitted,
  ] = result;

  return {
    name: fromHex(name, { to: "string" }),
    id: Number(id),
    institutionAddress: institutionAddress as string,
    recipientAddress: recipientAddress as string,
    goals: goals as Goal[],
    goalAttestationUIDs: goalAttestationUIDs as string[],
    goalBalances: goalBalances.map((balance: bigint) => Number(balance)) as number[],
    admissionAttestation: admissionAttestation as string,
    isAdmitted: isAdmitted as boolean,
  };
};
