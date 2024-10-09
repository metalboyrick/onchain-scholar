// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockIDRX is ERC20 {
  constructor(
    uint256 initialSupply
  ) ERC20("Mock IDRX", "IDRX") {
    // Mint the initial supply to the contract owner
    _mint(msg.sender, initialSupply);
  }
}
