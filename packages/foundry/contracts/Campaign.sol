//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that facilitates crowdfunded scholarship campaigns;
 * @author metalboyrick
 */
contract Campaign {
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
    }

    // state variables for our campaign contracts
    bytes32 public name;
    address public institutionAddress;
    address public recipientAddress;
    address public parentAddress;

    Goal[] public goals;
    bytes32[] public goalsAttestationUIDs;
    uint256[] public goalBalances;

    bytes32 public admissionAttestation;
    bool public isAdmitted;

    // Constructor: Called once on contract deployment
    // Check packages/foundry/deploy/Deploy.s.sol
    constructor(
        bytes32 _name,
        address _institutionAddress,
        address _recipientAddress,
        address _parentAddress,
        Goal[] memory _goals
    ) {
        // fill in fixed data
        name = _name;
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

    // private function to be called upon revocation
    function refund(uint256 _goalIndex) private {
        // find goal
        // verify if balance is enough
        // execute refund to all backers
        // set goal status to refunded
    }

    function setGoalAttestation(
        bytes32 _goalAttestationUID,
        uint256 _goalIndex
    ) public {
        // validate UID from EAS
        // set attestation to attestation array
        // determine to status
        // if accepted, grant money
        // if rejected, refund
    }

    function sendToRecipient(uint256 _amount) private {
        // send funds to recipient
    }

    function sendToInstitution(uint256 _amount) private {
        // send funds to institution
    }

    function attestAdmission(bytes32 _admissionAttestationUID) public {
        // validate UID from EAS (for existence)
        // set admission attestation variable
        // set is admitted to true
    }

    // for dropouts or misconduct
    function revokeAdmission() public {
        // revoke EAS attestation (or can be done in FE and validated here)
        // set is admitted to false
        // call refund on latest campaign
    }

    function getCampaignDetails() public {
        // return all necessary variables
    }
}
