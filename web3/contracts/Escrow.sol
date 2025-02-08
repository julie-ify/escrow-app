// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./EscrowFactory.sol";

contract Escrow {
    address public arbiter;
    address public beneficiary;
    address public depositor;
    bool public isApproved;
    EscrowFactory factory;

    constructor(
        address _arbiter,
        address _beneficiary,
        address _depositor,
        address _factory
    ) payable {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = _depositor;
        factory = EscrowFactory(_factory);
    }

    event Approved(uint amount);

    function approve() external {
        require(msg.sender == arbiter, "Only arbiter can approve");
        require(!isApproved, "Already approved");

        uint balance = address(this).balance;
        (bool sent, ) = payable(beneficiary).call{value: balance}("");
        require(sent, "Failed to send Ether");

        emit Approved(balance);
        isApproved = true;
				
        factory.markAsApproved(address(this), balance);
    }
}
