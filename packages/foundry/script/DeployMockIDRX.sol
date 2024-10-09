// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { MockIDRX } from "../contracts/MockIDRX.sol";
import "./DeployHelpers.s.sol";

contract DeployMockIDRX is ScaffoldETHDeploy {
  function run() external returns (address) {
    // Deploy the MockIDRX contract with an initial supply of 1,000,000,000,000 tokens
    MockIDRX token = new MockIDRX(1_000_000_000_000 * 10 ** 18);

    // Log the address of the deployed contract
    console.logString(
      string.concat("Mock IDRX deployed at:", vm.toString(address(token)))
    );

    return address(token);
  }
}
