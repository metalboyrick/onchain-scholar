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

export const MOCK_IDRX_CONTRACT = {
  address: "0xd369B2b99CC98FC25aF686e132fB10dE5C7349a6",
  abi: [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_spender",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_from",
          type: "address",
        },
        {
          name: "_to",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [
        {
          name: "",
          type: "uint8",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "balance",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_to",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
        {
          name: "_spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      payable: true,
      stateMutability: "payable",
      type: "fallback",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
  ] as const,
};
