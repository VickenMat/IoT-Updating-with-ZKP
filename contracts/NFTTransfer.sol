// SPDX-License-Identifier: MIT

pragma solidity >=0.8.19 <=0.8.23;

import "hardhat/console.sol";

contract NFTTransfer {
    uint256 public immutable baseReward = 10; // base amount multiplier to distributor for completing process
    uint256 public immutable numBlocksUpdateOpen; // how many blocks to be open for process to be completed
    uint256 public immutable blockStart; // starting block used for rewarding
    uint256 public immutable rewardAmount; // amount distributor receives in full

    address public manufacturer; // manufacturer wallet address
    address public distributor; // distributor wallet address
    address public iotDevice; // IoT Device wallet address
    // address public winner;

    bool public isProofApproved = true; // checks if the proof is true
    bool public isPoDSignatureGenerated = true; // checks if the PoS Signature is generated
    bool public isUpdateApplied = true; // checks if the update has been applied

    constructor(
        uint256 _numBlocksUpdateOpen // number of blocks the update process can be open for
    ) {
        numBlocksUpdateOpen = _numBlocksUpdateOpen;
        // sets block reward for successfuly completing update process
        // the lower the numBlocksUpdateOpen, quicker your do the work, the larger the reward
        rewardAmount = (baseReward / numBlocksUpdateOpen) * 100;
        blockStart = block.number;
        manufacturer = msg.sender;
    }

    // returns the base reward multiplier
    function getBaseReward() public view returns (uint256) {
        return baseReward;
    }

    // returns the number of blocks update is open for
    function getNumBlocksUpdateOpen() public view returns (uint256) {
        return numBlocksUpdateOpen;
    }

    // returns the reward amount
    function getRewardAmount() public view returns (uint256) {
        return rewardAmount;
    }

    // returns the manufacturers address
    function getManufacturerAddress() public view returns (address) {
        return manufacturer;
    }

    // returns the distributors address
    function getDistributorAddress() public view returns (address) {
        return distributor;
    }

    // returns the IoT Devices address
    function getIoTDeviceAddress() public view returns (address) {
        return iotDevice;
    }

    function test() public payable returns (address) {
        // checks if the update has been applied
        require(
            isUpdateApplied,
            "Device is currently up to date with the latest firmware!"
        );
        // checks if iot device address owns certain NFT ( update, encryption key, and PoDSig)
        require(
            iotDevice == address(0),
            "IoT Device has been successfully updated!"
        );
        // checks if manufacturer is sending the update NFT to themselves
        require(
            msg.sender != manufacturer,
            "Manufacturer cannot send update to themselves"
        );

        // check if the duration of the auction has passed by seeing what block we're on
        require(
            block.number - blockStart <= numBlocksUpdateOpen,
            "Max block number exceeded - Update window has closed- Please try again"
        );

        // checks if the manufacturers balance is greater than 0
        require(
            manufacturer.balance > 0,
            "Your account balance is not greater than 0"
        );

        // require(nft to be moved at least once);

        payable(distributor).transfer(msg.value); // transfers wei from manufacturer to distributor

        isUpdateApplied = false; // sets bool to false

        return distributor;
    }

    // returns balance of requested address
    function balanceOf(address) public view returns (uint256) {
        return address(this).balance;
    }
}
