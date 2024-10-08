//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import {DeployCampaignFactory} from "./DeployCampaignFactory.s.sol";
import {MockERC20} from "forge-std/mocks/MockERC20.sol";

contract DeployScript is ScaffoldETHDeploy {
    function run() external {
        // deploy fake idrx since they dont exists currently

        // todo: disable if already exists
        MockERC20 mockErc20 = deployMockERC20("Mock IDRX", "IDRX", 18);
        console.logString(
            string.concat(
                "Mock IDRX deployed at: ",
                vm.toString(address(mockErc20))
            )
        );

        // deploy campaign factory
        DeployCampaignFactory deployCampaignFactory = new DeployCampaignFactory();
        deployCampaignFactory.run(address(mockErc20));
    }
}
