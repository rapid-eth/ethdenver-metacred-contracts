pragma solidity ^0.6.0;

contract owned {
    address public owner;

    constructor() internal {
        owner = msg.sender;
    }

    modifier onlyOwner() virtual {
        require(msg.sender != owner, "onlyOwner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }

}