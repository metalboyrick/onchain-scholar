//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

import "./lib/CampaignMetadataLib.sol";

/**
 * A smart contract that facilitates crowdfunded scholarship campaigns;
 * @author metalboyrick
 */
contract Campaign {
    using CampaignMetadataLib for CampaignMetadataLib.Goal;

    // state variables for our campaign contracts
    bytes32 public name;
    uint256 public id;
    address public institutionAddress;
    address public recipientAddress;
    address public parentAddress;

    CampaignMetadataLib.Goal[] public goals;
    bytes32[] public goalsAttestationUIDs;
    uint256[] public goalBalances;

    bytes32 public admissionAttestation;
    bool public isAdmitted;

    // Constructor: Called once on contract deployment
    // Check packages/foundry/deploy/Deploy.s.sol
    constructor(
        bytes32 _name,
        uint256 _id,
        address _institutionAddress,
        address _recipientAddress,
        address _parentAddress,
        CampaignMetadataLib.Goal[] memory _goals
    ) {
        // fill in fixed data
        name = _name;
        id = _id;
        institutionAddress = _institutionAddress;
        recipientAddress = _recipientAddress;
        parentAddress = _parentAddress;
        goals = _goals;

        // create empty array
        goalsAttestationUIDs = new bytes32[](_goals.length);
        goalBalances = new uint256[](_goals.length);

        // set admission attestation to empty
        admissionAttestation = "";
        isAdmitted = false;
    }

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}

    function fund(uint256 _goalIndex) public {
        // check balance of user wallet
        // send money to this contract
        // updates funds list
    }

    // remaining fundable space for goal to prevent excess.
    function getFundable(uint256 _goalIndex) public view {
        // get selected goal
        // check target - current contract funds
    }

    // private function to be called upon revocation
    function refund(uint256 _goalIndex) private {
        // find goal
        // verify if balance is enough
        // execute refund to all backers
        // set goal status to refunded
    }

    function setGoalAttestation(
        bytes32 _goalAttestationUID,
        uint256 _goalIndex,
        address _easAddress
    ) public {
        // validate UID from EAS
        // set attestation to attestation array
        // open voting
        // if accepted, grant money
        // if rejected, refund
    }

    function sendToRecipient(uint256 _amount) private {
        // send funds to recipient
    }

    function sendToInstitution(uint256 _amount) private {
        // send funds to institution
    }

    // the eas address is passed in so that we can regulate from front end
    function attestAdmission(
        bytes32 _admissionAttestationUID,
        address _easAddress
    ) public {
        // validate UID from EAS (for existence)
        // set admission attestation variable
        // set is admitted to true
    }

    // for dropouts or misconduct
    // the eas address is passed in so that we can regulate from front end
    function revokeAdmission(address _easAddress) public {
        // revoke EAS attestation (or can be done in FE and validated here)
        // set is admitted to false
        // call refund on latest campaign
    }

    function getCampaignDetails() public view returns (Campaign) {
        return this;
    }
}
