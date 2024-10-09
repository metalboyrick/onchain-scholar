//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import {DeployCampaignFactory} from "./DeployCampaignFactory.s.sol";
import {MockERC20} from "forge-std/mocks/MockERC20.sol";

contract DeployScript is ScaffoldETHDeploy {
    address erc20Address;

    function run() external {
        // deploy fake idrx since they dont exists currently
        erc20Address = vm.envAddress("ERC20_CONTRACT_ADDRESS");

        // todo: disable if already exists
        if (erc20Address == address(0)) {
            MockERC20 mockErc20 = deployMockERC20("Mock IDRX", "IDRX", 18);
            erc20Address = address(mockErc20);
            console.logString(
                string.concat(
                    "Mock IDRX deployed at: ",
                    vm.toString(address(mockErc20))
                )
            );
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
