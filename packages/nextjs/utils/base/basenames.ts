import { BASENAME_L2_RESOLVER_ADDRESS, L2_RESOLVER_ABI } from "./constants";
import { Address, PublicClient, encodePacked, keccak256, namehash } from "viem";
import { base, mainnet } from "viem/chains";

export const convertChainIdToCoinType = (chainId: number): string => {
  // L1 resolvers to addr
  if (chainId === mainnet.id) {
    return "addr";
  }

  const cointype = (0x80000000 | chainId) >>> 0;
  return cointype.toString(16).toLocaleUpperCase();
};

export const convertReverseNodeToBytes = (address: Address, chainId: number) => {
  const addressFormatted = address.toLocaleLowerCase() as Address;
  //@ts-ignore
  const addressNode = keccak256(addressFormatted.substring(2) as Address);
  const chainCoinType = convertChainIdToCoinType(chainId);
  const baseReverseNode = namehash(`${chainCoinType.toLocaleUpperCase()}.reverse`);
  const addressReverseNode = keccak256(encodePacked(["bytes32", "bytes32"], [baseReverseNode, addressNode]));
  return addressReverseNode;
};

// Function to resolve a Basename
export async function getBasename(address: Address, publicClient: PublicClient) {
  try {
    const addressReverseNode = convertReverseNodeToBytes(address, base.id);
    const basename = await publicClient.readContract({
      abi: L2_RESOLVER_ABI,
      address: BASENAME_L2_RESOLVER_ADDRESS,
      functionName: "name",
      args: [addressReverseNode],
    });
    console.log({ basename });
    if (basename) {
      return basename;
    }

    return;
  } catch (error) {
    // Handle the error accordingly
    console.error("Error resolving Basename:", error);
  }
}
