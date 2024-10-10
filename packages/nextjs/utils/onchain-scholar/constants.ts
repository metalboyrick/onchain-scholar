import deployedContracts from "~~/contracts/deployedContracts";
import scaffoldConfig from "~~/scaffold.config";

export const CAMPAIGN_FACTORY_CONTRACT = deployedContracts[scaffoldConfig.targetNetworks[0].id].CampaignFactory;

export const CAMPAIGN_CONTRACT = {
  abi: [
    {
      type: "constructor",
      inputs: [
        {
          name: "_name",
          type: "bytes32",
          internalType: "bytes32",
        },
        {
          name: "_id",
          type: "uint256",
          internalType: "uint256",
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
          name: "_parentAddress",
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
      name: "admissionAttestation",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "bytes32",
          internalType: "bytes32",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "attestAdmission",
      inputs: [
        {
          name: "_admissionAttestationUID",
          type: "bytes32",
          internalType: "bytes32",
        },
        {
          name: "_admissionAttestationEncodedData",
          type: "bytes",
          internalType: "bytes",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "eas",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract IEAS",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "erc20",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract IERC20",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "fund",
      inputs: [
        {
          name: "_goalIndex",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "_amount",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "getCampaignDetails",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "bytes32",
          internalType: "bytes32",
        },
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "",
          type: "address",
          internalType: "address",
        },
        {
          name: "",
          type: "address",
          internalType: "address",
        },
        {
          name: "",
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
        {
          name: "",
          type: "bytes32[]",
          internalType: "bytes32[]",
        },
        {
          name: "",
          type: "uint256[]",
          internalType: "uint256[]",
        },
        {
          name: "",
          type: "bytes32",
          internalType: "bytes32",
        },
        {
          name: "",
          type: "bool",
          internalType: "bool",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getFundable",
      inputs: [
        {
          name: "_goalIndex",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "goalBalances",
      inputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "goals",
      inputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
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
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "goalsAttestationUIDs",
      inputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "bytes32",
          internalType: "bytes32",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "id",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "institutionAddress",
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
      name: "isAdmitted",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "bool",
          internalType: "bool",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "name",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "bytes32",
          internalType: "bytes32",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "parentAddress",
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
      name: "recipientAddress",
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
      name: "revokeAdmission",
      inputs: [
        {
          name: "_revokedAttestationUID",
          type: "bytes32",
          internalType: "bytes32",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "setGoalAttestation",
      inputs: [
        {
          name: "_goalAttestationUID",
          type: "bytes32",
          internalType: "bytes32",
        },
        {
          name: "_goalIndex",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "_goalAttestationEncodedData",
          type: "bytes",
          internalType: "bytes",
        },
        {
          name: "gpa",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "passOrFail",
          type: "bool",
          internalType: "bool",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
  ] as const,
};
