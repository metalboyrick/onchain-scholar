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
    uint256 minGPA;
    bool passOrFail;
  }

  struct Goal {
    bytes32 name;
    uint256 target;
    Criteria criteria;
    Status status;
    uint256 sendToRecipient;
    uint256 sendToInstitution;
    address[] backers;
  }
}
