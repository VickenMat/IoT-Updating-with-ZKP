// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <=0.8.23;

contract IoTUpdate {
    uint256 public immutable baseReward = 10;
    uint256 public immutable numBlocksUpdateOpen;
    address public manufacturer;
    address public distributor;
    address public iotDevice;
    bool public isProofApproved = true;
    bool public isPoDSignatureGenerated = true;
    bool public isUpdateApplied = true;

    modifier onlyManufacturer() {
        require(msg.sender == manufacturer, "Ownable: caller is not the owner");
        _;
    }

    constructor(uint256 _numBlocksUpdateOpen) {
        numBlocksUpdateOpen = _numBlocksUpdateOpen;
        manufacturer = msg.sender;
    }

    function getAddress() public view returns (address) {
        return address(this);
    }

    function getNumBlocksUpdateOpen() public view returns (uint256) {
        return numBlocksUpdateOpen;
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

    function update() public payable {
        require(
            isUpdateApplied,
            "Device is currently up to date with the latest firmware!"
        );
        require(
            iotDevice == address(2),
            "IoT device address must be set before update"
        );
        require(
            msg.sender != manufacturer,
            "Manufacturer cannot send update to themselves"
        );
        require(
            block.number - block.number <= numBlocksUpdateOpen,
            "Max block number exceeded - Update window has closed- Please try again"
        );
        require(
            manufacturer.balance > 0,
            "Your account balance is not greater than 0"
        );

        payable(distributor).transfer(msg.value);
        isUpdateApplied = false;
    }
}
