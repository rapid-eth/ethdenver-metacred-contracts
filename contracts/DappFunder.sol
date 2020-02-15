pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import "./ECDSA.sol";
import "./owned.sol";

contract DappFunder is owned {

    using ECDSA for bytes32;

    mapping (address => bool) public signerDelegates;

    bool public stopped;

    struct MetaTransaction {
        address processor;
        bytes data;
    }
    
    fallback() external payable { }

    //gas cost must be 100% refunded to sender
    function executeMetaTransaction(bytes memory encodedMetaTX, bytes memory sig) public {
        uint startGasLeft = gasleft();

        require(!stopped, "contract is stopped");

        //verify sig here
        require(verifySignature(keccak256(encodedMetaTX), sig), "not signed");
        MetaTransaction memory mtx;

        (mtx.processor,
        mtx.data) = abi.decode(encodedMetaTX, (address,bytes));

        //execute transaction
        (bool worked,) = mtx.processor.call(abi.encodeWithSignature("proxy(bytes)",mtx.data));
        require(worked, "did not work");

        emit TransactionRelayed(msg.sender, mtx.processor);
        uint gasRemain = gasleft();
        uint gasRefund = ((startGasLeft - gasRemain)*tx.gasprice) + 638080000000000; //TODO?
        msg.sender.transfer(gasRefund);
    }
    
    function stop() public onlyOwner {
        stopped = true;
    }

    function go() public onlyOwner {
        stopped = false;
    }

    function encodeMetaTransction(address _processor, bytes memory data) public pure returns (bytes memory) {
        return abi.encode(_processor, data);
    }

    function getMTX(bytes memory encodedMetaTX) public pure returns (MetaTransaction memory mtx) {
        (mtx.processor,
        mtx.data) = abi.decode(encodedMetaTX, (address,bytes));

    }

    function verifySignature(bytes32 _encodedMetaHash, bytes memory signature) internal view returns (bool) {
        address signer = _encodedMetaHash.toEthSignedMessageHash().recover(signature);
        return signerDelegates[signer];
    }

    event TransactionRelayed(address indexed relayer, address indexed contractCalled);
}
