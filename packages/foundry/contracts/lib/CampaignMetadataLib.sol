// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

library CampaignMetadataLib {
    enum Status {
        Idle,
        Running,
        Granted,
        Refunded
    }

    // for MVP we just use gpa for criteria
    struct Criteria {
        uint minGPA;
        bool passOrFail;
    }

    // need this struct to refund and know allocation per goal
    struct BackersAndAllocs {
        address backerAddress;
        uint256 valueStaked;
    }

    struct Goal {
        bytes32 name;
        uint256 target;
        uint256 totalValue;
        Criteria criteria;
        Status status;
        BackersAndAllocs[] backersAndValues;
        uint256 sendToRecipient;
        uint256 sendToInstitution;
    }
}
