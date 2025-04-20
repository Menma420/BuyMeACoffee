// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BuyMeACoffee {
    struct Memo {
        address from;
        string name;
        string message;
        uint256 timestamp;
    }

    address payable public owner;
    Memo[] public memos;

    constructor() {
        owner = payable(msg.sender);
    }

    event NewMemo(
        address indexed from,
        string name,
        string message,
        uint256 timestamp
    );

    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Can't buy coffee for free!");

        memos.push(Memo(msg.sender, _name, _message, block.timestamp));
        emit NewMemo(msg.sender, _name, _message, block.timestamp);
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function withdrawTips() public {
        require(msg.sender == owner, "Only owner can withdraw");
        owner.transfer(address(this).balance);
    }
}
