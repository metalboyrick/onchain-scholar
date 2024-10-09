//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/CampaignFactory.sol";
import "./DeployHelpers.s.sol";

contract DeployCampaignFactory is ScaffoldETHDeploy {
  // use `deployer` from `ScaffoldETHDeploy`
  // only deplloy CampaignFactory
  function run(
    address erc20Address
  ) external ScaffoldEthDeployerRunner {
    address easAddress = vm.envAddress("EAS_CONTRACT_ADDRESS");

    // use known eas and the erc20 address on base sepolia
    CampaignFactory yourContract = new CampaignFactory(easAddress, erc20Address);
    console.logString(
      string.concat(
        "CampaignFactory deployed at: ", vm.toString(address(yourContract))
      )
    );
  }
}
