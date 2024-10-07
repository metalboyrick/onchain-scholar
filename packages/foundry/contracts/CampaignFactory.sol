//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./lib/CampaignMetadataLib.sol";
import "./Campaign.sol";

contract CampaignFactory {
    using CampaignMetadataLib for CampaignMetadataLib.Goal;

    Campaign[] campaigns;
    uint256 idCounter = 0;
    mapping(address => Campaign[]) recipentAddressToCampaignMap;
    mapping(address => Campaign[]) institutionAddressToCampaignMap;

    function createCampaign(
        bytes32 _name,
        address _institutionAddress,
        address _recipientAddress,
        CampaignMetadataLib.Goal[] memory _goals
    ) public returns (address) {
        idCounter++;
        Campaign newCampaign = new Campaign(
            _name,
            idCounter,
            _institutionAddress,
            _recipientAddress,
            address(this),
            _goals
        );
        campaigns.push(newCampaign);

        recipentAddressToCampaignMap[_recipientAddress].push(newCampaign);
        institutionAddressToCampaignMap[_institutionAddress].push(newCampaign);

        return address(newCampaign);
    }

    function getCampaignAddressesFromRecipientAddress(
        address _recipientAddress
    ) public view returns (Campaign[] memory) {
        return recipentAddressToCampaignMap[_recipientAddress];
    }

    function getCampaignAddressFromInstitutionAddress(
        address _institutionAddress
    ) public view returns (Campaign[] memory) {
        return institutionAddressToCampaignMap[_institutionAddress];
    }
}
