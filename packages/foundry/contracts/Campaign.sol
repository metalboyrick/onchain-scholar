//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
// import "forge-std/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IEAS.sol";
// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

import "./lib/CampaignMetadataLib.sol";

/**
 * A smart contract that facilitates crowdfunded scholarship campaigns;
 * @author metalboyrick
 */
contract Campaign {
    using CampaignMetadataLib for CampaignMetadataLib.Goal;

    struct BackersAndValues {
        mapping(address => uint256) data;
    }

    // state variables for our campaign contracts
    bytes32 public name;
    uint256 public id;
    address public institutionAddress;
    address public recipientAddress;
    address public parentAddress;

    // contract instances
    IERC20 public erc20;
    IEAS public eas;

    uint256 currentGoalIndex = 0;
    CampaignMetadataLib.Goal[] public goals;
    BackersAndValues[] goalBackersAndValues;
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
        CampaignMetadataLib.Goal[] memory _goals,
        address _easAddress,
        address _erc20Address
    ) {
        // fill in fixed data
        name = _name;
        id = _id;
        institutionAddress = _institutionAddress;
        recipientAddress = _recipientAddress;
        parentAddress = _parentAddress;

        // set admission attestation to empty
        admissionAttestation = "";
        isAdmitted = false;

        // set erc20 and eas address
        erc20 = IERC20(_erc20Address);
        eas = IEAS(_easAddress);

        // copy goals
        for (uint128 i = 0; i < _goals.length; i++) goals.push(_goals[i]);

        // create empty array
        goalsAttestationUIDs = new bytes32[](_goals.length);
        goalBalances = new uint256[](_goals.length);
    }

    modifier isValidGoalAddress(uint256 _goalIndex) {
        require(
            _goalIndex >= 0 && _goalIndex < goals.length,
            "Invalid goalIndex"
        );
        _;
    }

    modifier isValidAttestation(bytes32 uid) {
        require(eas.isAttestationValid(uid), "Invalid EAS Attestation");
        require(
            eas.getAttestation(uid).attester == institutionAddress,
            "Attestation not issued by institution"
        );
        require(
            eas.getAttestation(uid).recipient == recipientAddress,
            "Attestation is not meant for recipient"
        );
        _;
    }

    modifier isCampaignNotFinished() {
        require(
            currentGoalIndex < goals.length,
            "All goals have been completed"
        );
        _;
    }

    modifier onlyInstitution() {
        require(
            msg.sender == institutionAddress,
            "Sender must be institution only"
        );
        _;
    }

    function fund(
        uint256 _goalIndex,
        uint256 _amount
    ) public isValidGoalAddress(_goalIndex) {
        // validate amount
        require(_amount > 0, "Payment amount must be greater than 0");

        // transfer tokens
        require(
            erc20.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        // update funds list
        goalBalances[_goalIndex] += _amount;
        goalBackersAndValues[_goalIndex].data[msg.sender] += _amount;
    }

    // remaining fundable space for goal to prevent excess.
    function getFundable(
        uint256 _goalIndex
    ) public view isValidGoalAddress(_goalIndex) returns (uint256) {
        return goals[_goalIndex].target - goalBalances[_goalIndex];
    }

    // private function to be called upon revocation
    function refund(uint256 _goalIndex) private isValidGoalAddress(_goalIndex) {
        // find goal
        // verify if balance is enough
        require(
            erc20.balanceOf(address(this)) >= goalBalances[_goalIndex],
            "Contract does not have enough balance"
        );

        // execute refund to all backers
        for (uint256 i = 0; i < goals[_goalIndex].backers.length; i++) {
            require(
                erc20.transferFrom(
                    address(this),
                    goals[_goalIndex].backers[i],
                    goalBackersAndValues[_goalIndex].data[
                        goals[_goalIndex].backers[i]
                    ]
                ),
                "Transfer failed"
            );
        }

        // set goal status to refunded
        goals[_goalIndex].status = CampaignMetadataLib.Status.Refunded;
    }

    // tentative schema:
    // {
    //     type: "goal"
    //     gpa: number,
    //     passOrFail: boolean,
    // }
    function setGoalAttestation(
        bytes32 _goalAttestationUID,
        uint256 _goalIndex,
        bytes memory _goalAttestationEncodedData, // get attestation from client and send its data value here.
        uint256 gpa,
        bool passOrFail
    ) public onlyInstitution isValidAttestation(_goalAttestationUID) {
        // validate UID from EAS
        require(
            goalsAttestationUIDs[_goalIndex].length == 0,
            "Goal already attested"
        );

        // validate data
        require(
            keccak256(_goalAttestationEncodedData) ==
                keccak256(eas.getAttestation(_goalAttestationUID).data),
            "Data is invalid or corrupted"
        );

        // set attestation to attestation array
        goalsAttestationUIDs[_goalIndex] = _goalAttestationUID;

        // if satisfy, grant money
        if (gpa >= goals[_goalIndex].criteria.minGPA && passOrFail) {
            // TODO: scheme for institution, for now will trust the recipient
            sendToRecipient(goalBalances[_goalIndex]);
        }
        // if not satisfy, refund
        else {
            refund(_goalIndex);
        }

        // either way, increment goal index
        currentGoalIndex = currentGoalIndex + 1;
    }

    function sendToRecipient(uint256 _amount) private {
        // send funds to recipient
        require(
            erc20.balanceOf(address(this)) >= _amount,
            "Contract does not have enough balance"
        );
        require(
            erc20.transferFrom(address(this), recipientAddress, _amount),
            "Transfer failed"
        );
    }

    function sendToInstitution(uint256 _amount) private {
        // send funds to institution
        require(
            erc20.balanceOf(address(this)) >= _amount,
            "Contract does not have enough balance"
        );
        require(
            erc20.transferFrom(address(this), institutionAddress, _amount),
            "Transfer failed"
        );
    }

    function attestAdmission(
        bytes32 _admissionAttestationUID,
        bytes memory _admissionAttestationEncodedData
    ) public onlyInstitution isValidAttestation(_admissionAttestationUID) {
        // validate data
        require(
            keccak256(_admissionAttestationEncodedData) ==
                keccak256(eas.getAttestation(_admissionAttestationUID).data),
            "Data is invalid or corrupted"
        );
        // set admission attestation variable
        admissionAttestation = _admissionAttestationUID;

        // set is admitted to true
        isAdmitted = true;
    }

    // for dropouts or misconduct
    function revokeAdmission(
        bytes32 _revokedAttestationUID
    ) public onlyInstitution isValidAttestation(_revokedAttestationUID) {
        // validate whether attestation has been revoked
        require(
            eas.getAttestation(_revokedAttestationUID).revocationTime > 0,
            "This UID has not been revoked"
        );

        // set is admitted to false
        isAdmitted = false;

        // call refund on latest campaign
        refund(currentGoalIndex);
    }

    function getCampaignDetails() public view returns (Campaign) {
        return this;
    }
}
