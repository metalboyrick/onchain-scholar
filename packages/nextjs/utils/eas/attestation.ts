import { encodeGpa } from "../onchain-scholar/common";
import { EAS_ADMISSION_SCHEMA_UID, EAS_CONTRACT_ADDRESS } from "./constants";
import { clientToSigner } from "./ethersAdapter";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { toHex } from "viem";

export const easAttestAdmission = async (signer: ReturnType<typeof clientToSigner>, recipient: string) => {
  const eas = new EAS(EAS_CONTRACT_ADDRESS);
  eas.connect(signer);

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder("bytes32 type");
  const encodedData = schemaEncoder.encodeData([
    { name: "type", value: toHex("admission", { size: 32 }), type: "bytes32" },
  ]);

  const transaction = await eas.attest({
    schema: EAS_ADMISSION_SCHEMA_UID,
    data: {
      recipient,
      expirationTime: 0n,
      revocable: true, // Be aware that if your schema is not revocable, this MUST be false
      data: encodedData,
    },
  });

  const newAttestationUID = await transaction.wait();

  return {
    uid: newAttestationUID,
    txnReceipt: transaction.receipt,
    txnData: transaction.data,
    encodedData,
  };
};

export const easAttestGoal = async (
  signer: ReturnType<typeof clientToSigner>,
  { recipient, gpa }: { recipient: string; gpa: number },
) => {
  const eas = new EAS(EAS_CONTRACT_ADDRESS);
  eas.connect(signer);

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder("bytes32 type, uint256 gpa");
  const encodedData = schemaEncoder.encodeData([
    { name: "type", value: toHex("goal", { size: 32 }), type: "bytes32" },
    { name: "gpa", value: encodeGpa(gpa), type: "uint256" },
  ]);

  const transaction = await eas.attest({
    schema: EAS_ADMISSION_SCHEMA_UID,
    data: {
      recipient,
      expirationTime: 0n,
      revocable: false,
      data: encodedData,
    },
  });

  const newAttestationUID = await transaction.wait();

  return {
    uid: newAttestationUID,
    txnReceipt: transaction.receipt,
    txnData: transaction.data,
    encodedData,
  };
};

export const easRevokeAdmission = async (signer: ReturnType<typeof clientToSigner>, admissionUid: string) => {
  const eas = new EAS(EAS_CONTRACT_ADDRESS);
  eas.connect(signer);

  const transaction = await eas.revoke({
    schema: EAS_ADMISSION_SCHEMA_UID,
    data: {
      uid: admissionUid,
    },
  });

  return await transaction.wait();
};
