//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import {DeployCampaignFactory} from "./DeployCampaignFactory.s.sol";
import {DeployMockIDRX} from "./DeployMockIDRX.sol";
import {MockIDRX} from "../contracts/MockIDRX.sol";

contract DeployScript is ScaffoldETHDeploy {
    function run() external {
        // deploy fake idrx since they dont exists currently
        address erc20Address = vm.envAddress("ERC20_CONTRACT_ADDRESS");

        // MockIDRX token = new MockIDRX(1_000_000_000_000_000 * (10 ** 18));

        // // Log the address of the deployed contract
        // console.logString(
        //     string.concat("Mock IDRX deployed at:", vm.toString(address(token)))
        // );

        // erc20Address = address(token);

        // deploy campaign factory
        DeployCampaignFactory deployCampaignFactory = new DeployCampaignFactory();
        deployCampaignFactory.run(erc20Address);
    }
}
