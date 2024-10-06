//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./lib/CampaignMetadataLib.sol";
import "./Campaign.sol";

contract CampaignFactory {
    using CampaignMetadataLib for CampaignMetadataLib.Goal;

    Campaign[] campaigns;
    uint256 idCounter = 0;

    function createCampaign(
        bytes32 _name,
        address _institutionAddress,
        address _recipientAddress,
        CampaignMetadataLib.Goal[] memory _goals
    ) public returns (uint256) {
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
        return idCounter;
    }
}
