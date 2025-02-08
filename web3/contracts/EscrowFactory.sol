// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Escrow.sol";

contract EscrowFactory {
    struct EscrowData {
        address contractAddress;
        address arbiter;
        address beneficiary;
        address depositor;
        bool isApproved;
    }

    EscrowData[] public escrows;
    mapping(address => bool) public isEscrow;

    event EscrowCreated(
        address escrowAddress,
        address arbiter,
        address beneficiary,
        address depositor
    );
    event EscrowApproved(address escrowAddress, uint amount);

    function createEscrow(
        address _arbiter,
        address _beneficiary
    ) external payable {
        require(msg.value > 0, "Must send ETH to create escrow");

        Escrow newEscrow = new Escrow(
            _arbiter,
            _beneficiary,
            msg.sender,
            address(this)
        );
        address escrowAddress = address(newEscrow);

        escrows.push(
            EscrowData({
                contractAddress: escrowAddress,
                arbiter: _arbiter,
                beneficiary: _beneficiary,
                depositor: msg.sender,
                isApproved: false
            })
        );

        isEscrow[escrowAddress] = true;

        emit EscrowCreated(escrowAddress, _arbiter, _beneficiary, msg.sender);
    }

    function markAsApproved(address escrowAddress, uint amount) external {
        require(isEscrow[escrowAddress], "Invalid escrow contract");

        for (uint i = 0; i < escrows.length; i++) {
            if (escrows[i].contractAddress == escrowAddress) {
                require(
                    msg.sender == escrows[i].arbiter,
                    "Only arbiter can approve"
                );
                escrows[i].isApproved = true;
                emit EscrowApproved(escrowAddress, amount);
                break;
            }
        }
    }

    function getEscrows() external view returns (EscrowData[] memory) {
        return escrows;
    }
}
