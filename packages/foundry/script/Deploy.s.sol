//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import {DeployCampaignFactory} from "./DeployCampaignFactory.s.sol";
import {DeployMockIDRX} from "./DeployMockIDRX.sol";

contract DeployScript is ScaffoldETHDeploy {
    address erc20Address;

    function run() external {
        // deploy fake idrx since they dont exists currently
        erc20Address = vm.envAddress("ERC20_CONTRACT_ADDRESS");

        // todo: disable if already exists
        if (erc20Address == address(0)) {
            DeployMockIDRX deployMockIDRX = new DeployMockIDRX();
            erc20Address = deployMockIDRX.run();
        } else {
            console.logString(
                string.concat(
                    "Mock IDRX deployed at: ",
                    vm.toString(erc20Address)
                )
            );
        }

        // deploy campaign factory
        DeployCampaignFactory deployCampaignFactory = new DeployCampaignFactory();
        deployCampaignFactory.run(address(erc20Address));
    }
}
