// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenA is ERC20 {
    constructor(uint256 initialSupply) ERC20("tokenA", "tokenA") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 12;
    }
}
