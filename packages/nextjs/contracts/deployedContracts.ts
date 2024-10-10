/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    CampaignFactory: {
      address: "0x700b6a60ce7eaaea56f065753d8dcb9653dbad35",
      abi: [
        {
          type: "constructor",
          inputs: [
            {
              name: "_easAddress",
              type: "address",
              internalType: "address",
            },
            {
              name: "_erc20Address",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "createCampaign",
          inputs: [
            {
              name: "_name",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "_institutionAddress",
              type: "address",
              internalType: "address",
            },
            {
              name: "_recipientAddress",
              type: "address",
              internalType: "address",
            },
            {
              name: "_goals",
              type: "tuple[]",
              internalType: "struct CampaignMetadataLib.Goal[]",
              components: [
                {
                  name: "name",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "target",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "criteria",
                  type: "tuple",
                  internalType: "struct CampaignMetadataLib.Criteria",
                  components: [
                    {
                      name: "minGPA",
                      type: "uint256",
                      internalType: "uint256",
                    },
                    {
                      name: "passOrFail",
                      type: "bool",
                      internalType: "bool",
                    },
                  ],
                },
                {
                  name: "status",
                  type: "uint8",
                  internalType: "enum CampaignMetadataLib.Status",
                },
                {
                  name: "sendToRecipient",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "sendToInstitution",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "backers",
                  type: "address[]",
                  internalType: "address[]",
                },
              ],
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "easAddress",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "erc20Address",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getCampaignAddressFromInstitutionAddress",
          inputs: [
            {
              name: "_institutionAddress",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address[]",
              internalType: "contract Campaign[]",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getCampaignAddressesFromRecipientAddress",
          inputs: [
            {
              name: "_recipientAddress",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address[]",
              internalType: "contract Campaign[]",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "event",
          name: "CampaignCreated",
          inputs: [
            {
              name: "creator",
              type: "address",
              indexed: false,
              internalType: "address",
            },
            {
              name: "campaignContract",
              type: "address",
              indexed: false,
              internalType: "address",
            },
          ],
          anonymous: false,
        },
      ],
      inheritedFunctions: {},
    },
  },
  84532: {
    CampaignFactory: {
      address: "0xf4a95f32c0d5573eb4740a6b8cac07ebf8831b22",
      abi: [
        {
          type: "constructor",
          inputs: [
            {
              name: "_easAddress",
              type: "address",
              internalType: "address",
            },
            {
              name: "_erc20Address",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "createCampaign",
          inputs: [
            {
              name: "_name",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "_institutionAddress",
              type: "address",
              internalType: "address",
            },
            {
              name: "_recipientAddress",
              type: "address",
              internalType: "address",
            },
            {
              name: "_goals",
              type: "tuple[]",
              internalType: "struct CampaignMetadataLib.Goal[]",
              components: [
                {
                  name: "name",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "target",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "criteria",
                  type: "tuple",
                  internalType: "struct CampaignMetadataLib.Criteria",
                  components: [
                    {
                      name: "minGPA",
                      type: "uint256",
                      internalType: "uint256",
                    },
                    {
                      name: "passOrFail",
                      type: "bool",
                      internalType: "bool",
                    },
                  ],
                },
                {
                  name: "status",
                  type: "uint8",
                  internalType: "enum CampaignMetadataLib.Status",
                },
                {
                  name: "sendToRecipient",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "sendToInstitution",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "backers",
                  type: "address[]",
                  internalType: "address[]",
                },
              ],
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "easAddress",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "erc20Address",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getCampaignAddressFromInstitutionAddress",
          inputs: [
            {
              name: "_institutionAddress",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address[]",
              internalType: "contract Campaign[]",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getCampaignAddressesFromRecipientAddress",
          inputs: [
            {
              name: "_recipientAddress",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address[]",
              internalType: "contract Campaign[]",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "event",
          name: "CampaignCreated",
          inputs: [
            {
              name: "creator",
              type: "address",
              indexed: false,
              internalType: "address",
            },
            {
              name: "campaignContract",
              type: "address",
              indexed: false,
              internalType: "address",
            },
          ],
          anonymous: false,
        },
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
