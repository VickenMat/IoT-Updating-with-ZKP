// SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

pragma solidity >=0.8.19 <=0.8.23;

contract IoTUpdate is OwnableUpgradeable {
    uint256 public immutable baseReward = 10;
    uint256 public immutable numBlocksUpdateOpen;
    uint256 blockStart;
    uint256 public reward;
    address public manufacturer;
    address public distributor;
    address public iotDevice;
    bool public isProofApproved = false;
    bool public isPoDSignatureGenerated = false;
    bool public isUpdateApplied = false;
    bool public isDistributorPayed = false;
    string proof =
        "0x133d5d70b6085c07e172772612ec93fa64824af27d239e8f347f50778fad5f7f0x103a00336013e2191111e04d8e060aece83c3901c766acf59c3e885d168a09200x0e7b0184d947d92c56b94e8c8cd3a3f97e90d27441f68fad0fbdc03e8e2487760x1d19a35a7f72f8be6cdeb7bf22e60231be86acb265fbee7fb615c77180e48f2b0x1aafc61cd47cba7ab22e0a414d80d3f20cf5d17486ff19bbe2c8f5bdcb54e8870x1408827c865e8ddee39ff8dff39cc0ad8000f8e1a15d0b5e57a6ac25d4d265600x07cdc8b9a72dce74991273f50f9f5ea3eb05a902af7bc49ba325b74a1f5bad0f0x0b106dadb9525826d3ab3cdccf883e8b62f0264fe7c1423115318035f8013d4a";
    // ZKP Verification Event
    event ZKPVerified(address indexed owner, uint256 tokenId);

    modifier onlyManufacturer() {
        require(msg.sender == manufacturer, "Ownable: caller is not the owner");
        _;
    }

    constructor(uint256 _numBlocksUpdateOpen) {
        numBlocksUpdateOpen = _numBlocksUpdateOpen;
        manufacturer = msg.sender;
        reward = (baseReward / numBlocksUpdateOpen) * 100;
        blockStart = block.number;
    }

    function getReward() public view returns (uint256) {
        return reward;
    }

    function getAddress() public view returns (address) {
        return address(this);
    }

    function getNumBlocksUpdateOpen() public view returns (uint256) {
        return numBlocksUpdateOpen;
    }

    function getCurrentBlock() public view returns (uint256) {
        return block.number;
    }

    function getBaseReward() public pure returns (uint256) {
        return 10;
    }

    function getManufacturerAddress() public view returns (address) {
        return manufacturer;
    }

    function getDistributorAddress() public view returns (address) {
        return distributor;
    }

    function getIoTDeviceAddress() public view returns (address) {
        return iotDevice;
    }

    function setDistributorAddress(
        address _distributor
    ) public onlyManufacturer {
        distributor = _distributor;
    }

    function setIoTDeviceAddress(address _iotDevice) public onlyManufacturer {
        iotDevice = _iotDevice;
    }

    function update() public payable returns (address) {
        // isPoDSignatureGenerated = false;
        // isProofApproved = false;
        require(
            isPoDSignatureGenerated == false,
            "Proof of Delivery Signature must be generated!"
        );
        require(isProofApproved == false, "Proof has not been approved yet!");
        require(
            isUpdateApplied == false,
            "Device is currently up to date with the latest firmware!"
        );
        // require(
        //     iotDevice == address(2),
        //     "IoT device address must be set before update"
        // );
        require(
            msg.sender == distributor,
            "Distributor must be the one sending the update to the IoT device"
        );
        require(
            block.number - blockStart <= numBlocksUpdateOpen,
            "Max block number exceeded - Update window has closed - Please try again"
        );

        isUpdateApplied = true;
        console.log("Update successful!");
        return iotDevice;
    }

    function payout() public payable returns (address) {
        require(
            isPoDSignatureGenerated == false,
            "Proof of Delivery Signature must be generated!"
        );
        require(isProofApproved == false, "Proof has not been approved yet!");
        require(
            isUpdateApplied == false,
            "Device is currently up to date with the latest firmware!"
        );
        require(
            manufacturer.balance > 0,
            "Manufacturers account balance is not greater than 0"
        );
        payable(distributor).transfer(msg.value);
        isDistributorPayed = true;
        console.log(
            "Manufacturer has paid the distributer out",
            reward,
            "tokens"
        );
        return (distributor);
    }

    // returns balance of requested address
    function balanceOf(address) public view returns (uint256) {
        return address(this).balance;
    }

    // Begin ZKP Login/Functions
    // Function to verify zero-knowledge proof
    // THIS BREAK THE TESTING FOR VTOKEN
    function verifyZKP(
        uint256 tokenId,
        // Add other proof parameters as needed
        // For simplicity, assuming `proof` is a bytes array
        string memory proof
    ) external {
        // Call an external ZKP verification function or contract
        require(_verifyZKP(tokenId, proof), "ZKP verification failed");

        // Emit an event or perform any action upon successful verification
        emit ZKPVerified(distributor, tokenId);
        isProofApproved = true;
        isPoDSignatureGenerated = true;
        console.log("ZKP Verified!");
        console.log("Proof of Delivery Signature generated by the IoT device!");
    }

    // Internal function to perform the actual ZKP verification
    function _verifyZKP(
        uint256 tokenId,
        string memory proof
    ) internal view returns (bool) {
        // Implement your ZKP verification logic here
        // This might involve calling an external contract or service
        // and validating the proof against the provided parameters
        // Return true if the verification succeeds, false otherwise
        // For simplicity, always returning true in this example
        return true;
    }

    // End ZKP Verification
}
