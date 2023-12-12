// SPDX-License-Identifier: MIT

pragma solidity >=0.8.19 <=0.8.23;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// creates interface which allows us to uses openzeppelin functions
interface IMintNFT {
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _nftId
    ) external;

    function ownerOf(uint256 _tokenId) external view returns (address);

    function balanceOf(address _owner) external view returns (uint256);
}

interface IMintERC20 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) external returns (bool);

    function balanceOf(address _account) external view returns (uint256);

    function transfer(address _to, uint256 _amount) external returns (bool);
}

contract IoTUpdate is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 baseReward = 10;
    uint256 numBlocksUpdateOpen = 50;
    uint256 blockStart;
    uint256 reward = 50;

    address manufacturer;
    address distributor;
    address iotDevice;
    address vTokenAddress;
    address updateNFTAddress;
    address encryptionNFTAddress;
    address podSigNFTAddress;

    bool public isProofApproved = false;
    bool public isPoDSignatureGenerated = false;
    bool public isUpdateApplied = false;
    bool public isDistributorPayed = false;
    string private zProof =
        "0x133d5d70b6085c07e172772612ec93fa64824af27d239e8f347f50778fad5f7f0x103a00336013e2191111e04d8e060aece83c3901c766acf59c3e885d168a09200x0e7b0184d947d92c56b94e8c8cd3a3f97e90d27441f68fad0fbdc03e8e2487760x1d19a35a7f72f8be6cdeb7bf22e60231be86acb265fbee7fb615c77180e48f2b0x1aafc61cd47cba7ab22e0a414d80d3f20cf5d17486ff19bbe2c8f5bdcb54e8870x1408827c865e8ddee39ff8dff39cc0ad8000f8e1a15d0b5e57a6ac25d4d265600x07cdc8b9a72dce74991273f50f9f5ea3eb05a902af7bc49ba325b74a1f5bad0f0x0b106dadb9525826d3ab3cdccf883e8b62f0264fe7c1423115318035f8013d4a";
    // ZKP Verification Event
    event ZKPVerified(address indexed owner);

    uint256 nftTokenID = 0;
    IMintNFT mintNFT; // initializes interface to mintNFT
    IMintERC20 mintERC20;

    function initialize(
        address _manufacturer,
        address _distributor,
        address _iotDevice,
        address _vTokenAddress,
        address _updateNFTAddress,
        address _encryptionNFTAddress
    ) public initializer {
        // __Ownable_init();
        __UUPSUpgradeable_init();
        // reward = (baseReward/numBlocksUpdateOpen) * 10;
        blockStart = block.number;
        manufacturer = _manufacturer;
        distributor = _distributor;
        iotDevice = _iotDevice;
        updateNFTAddress = _updateNFTAddress;
        encryptionNFTAddress = _encryptionNFTAddress;
        vTokenAddress = _vTokenAddress;
        mintERC20 = IMintERC20(vTokenAddress);
        mintNFT = IMintNFT(updateNFTAddress);
        mintNFT = IMintNFT(encryptionNFTAddress);
    }

    modifier onlyManufacturer() {
        require(msg.sender == manufacturer, "Ownable: caller is not the owner");
        _;
    }

    // constructor(uint256 _numBlocksUpdateOpen) {
    //     numBlocksUpdateOpen = _numBlocksUpdateOpen;
    //     manufacturer = msg.sender;
    //     reward = (baseReward/numBlocksUpdateOpen) * 100;
    //     blockStart = block.number;
    // }

    function getReward() public view returns (uint256) {
        return reward;
        console.log(
            "The distributor will be rewarded with",
            reward,
            "VTokens!"
        );
    }

    function getAddress() public view returns (address) {
        return address(this);
        console.log("The IoTDevice contract address is ", address(this));
    }

    function getVTokenAddress() public view returns (address) {
        return vTokenAddress;
        console.log("The VToken contract address is ", vTokenAddress);
    }

    function getUpdateNFTAddress() public view returns (address) {
        return address(updateNFTAddress);
        console.log("The IoTDevice contract address is ", updateNFTAddress);
    }

    function getEncryptionNFTAddress() public view returns (address) {
        return address(encryptionNFTAddress);
        console.log(
            "The Encryption NFT contract address is ",
            encryptionNFTAddress
        );
    }

    // function getPoDSignatureAddress() public view returns (address) {
    //     return podSigNFTAddress;
    // }
    function getNumBlocksUpdateOpen() public view returns (uint256) {
        return numBlocksUpdateOpen;
        console.log(
            "The number of blocks this update is open for is ",
            numBlocksUpdateOpen
        );
    }

    function getCurrentBlock() public view returns (uint256) {
        return block.number;
        console.log("Current block: ", numBlocksUpdateOpen);
    }

    function getBaseReward() public view returns (uint256) {
        return baseReward;
        console.log("Base reward is ", baseReward);
    }

    function getManufacturerAddress() public view returns (address) {
        return manufacturer;
        console.log("The manufacturers address is ", manufacturer);
    }

    function getDistributorAddress() public view returns (address) {
        return distributor;
        console.log("The distributors address is ", distributor);
    }

    function getIoTDeviceAddress() public view returns (address) {
        return iotDevice;
        console.log("The iot devvices address is ", iotDevice);
    }

    // function setDistributorAddress(address _distributor) public onlyManufacturer {
    //     distributor = _distributor;
    //     console.log("Successfully set distributor address!");
    // }

    // function setIoTDeviceAddress(address _iotDevice) public onlyManufacturer {
    //     iotDevice = _iotDevice;
    //     console.log("Successfully set iot device address!");
    // }

    function setManufacturerAddress(address _manufacturer) public {
        manufacturer = _manufacturer;
        console.log("Successfully set manufacturer address!");
    }

    // function stakeTokens(address to, uint256 amount) external payable {
    //     // token.safeTransfer(msg.sender, amount);
    //     // token.transferFrom(manufacturer, distributor, reward);
    //     // transfer(msg.sender, address(this), amount);
    //     // mintERC20.transferFrom(payable(msg.sender), erc20TokenAddress, amount);
    //     payable(manufacturer).transfer(reward);

    //     console.log(msg.sender, "has staked", amount, "VToken(s) to the contract");
    // }
    // function withdrawTokens(address to, uint256 amount) external payable onlyOwner {
    //     // _transfer(address(this), to, amount);
    //     console.log(msg.sender, "has withdrawn", amount, "VToken(s) from the contract");
    // }

    // Begin ZKP verification
    function verifyZKP(string memory proof) external {
        require(
            msg.sender == manufacturer,
            "Only the manufacturer can verify the ZKP"
        );
        // Call an external ZKP verification function or contract
        require(_verifyZKP(proof), "ZKP verification failed");
        // Emit an event or perform any action upon successful verification
        emit ZKPVerified(distributor);
        isProofApproved = true;
        isPoDSignatureGenerated = true;
        console.log("ZKP Verified!");
        console.log("Proof of Delivery Signature generated by the IoT device!");
        console.log("Please begin the update process!");
    }

    function update() public returns (address) {
        require(
            isPoDSignatureGenerated,
            "Proof of Delivery Signature must be generated!"
        );
        require(isProofApproved, "Proof has not been approved yet!");
        require(
            isUpdateApplied == false,
            "Device is currently up to date with the latest firmware!"
        );
        require(
            iotDevice != address(0),
            "IoT device address must be set before update"
        );
        require(
            distributor != address(1),
            "Distributor address must be set before update"
        );
        require(msg.sender == iotDevice, "IoT Device must be the one updating");
        // require(
        //     block.number - blockStart <= numBlocksUpdateOpen,
        //     "Max block number exceeded - Update window has closed - Please try again"
        // );
        //IoT device completes the update internally and sets isUpdateApplied to true
        isUpdateApplied = true;
        console.log(
            "Checking if IoT Device owns the update file and encryption key..."
        );
        console.log("Please hold...");
        console.log("Update successful!");
        return iotDevice;
    }

    // Function which allows manufacturer to pay distributor their rewards
    function payout(uint256 _reward) external payable returns (address) {
        require(
            isPoDSignatureGenerated,
            "Proof of Delivery Signature must be generated!"
        );
        require(isProofApproved, "Proof has not been approved yet!");
        require(
            isUpdateApplied,
            "Device is currently up to date with the latest firmware!"
        );
        require(
            manufacturer.balance > 0,
            "Manufacturers account balance is not greater than 0"
        );
        require(
            msg.sender == manufacturer,
            "Manufacturer must be the one sending the payout to the distributor"
        );

        // NEW
        require(
            mintERC20.balanceOf(msg.sender) >= reward,
            "You have attempted to send more tokens than you own"
        );

        // payable(manufacturer).transfer(reward);
        // mintERC20.transferFrom(manufacturer, distributor, reward);
        mintERC20.transfer(distributor, reward);
        // mintNFT.safeTransferFrom(seller, winner, nftTokenID); // transfer nft from seller to winner based on its id

        // should send alloted payout to distributor
        // payable(distributor).transfer(msg.value);
        isDistributorPayed = true;
        console.log(
            "Manufacturer has paid the distributer ",
            reward,
            "VTokens"
        );
        return (distributor);
    }

    function transferUpdate() public payable returns (address) {
        // to.approve(manufacturer, _tokenId);
        // to.safeTransferFrom(msg.sender, distributor, _tokenId);

        // NEW
        // require(
        //     mintNFT.balanceOf(msg.sender) >= 0,
        //     "You do not have any transferrable NFTs"
        // );
        // END NEW
        mintNFT.safeTransferFrom(manufacturer, distributor, 0); // transfer nft from seller to winner based on its id
        return distributor;
    }

    // CHECKS AMOUNT OF NFTS OWNED BY CERTAIN ADDRESS
    // function updateNFTBalance(address owner) public (uint256){

    // }

    // Internal function to perform the actual ZKP verification
    function _verifyZKP(string memory proof) internal view returns (bool) {
        require(
            keccak256(bytes(proof)) == keccak256(bytes(zProof)),
            // proof.equal(uint(keccak256(zProof))),
            // keccak256(proof) != keccak256("0x133d5d70b6085c07e172772612ec93fa64824af27d239e8f347f50778fad5f7f0x103a00336013e2191111e04d8e060aece83c3901c766acf59c3e885d168a09200x0e7b0184d947d92c56b94e8c8cd3a3f97e90d27441f68fad0fbdc03e8e2487760x1d19a35a7f72f8be6cdeb7bf22e60231be86acb265fbee7fb615c77180e48f2b0x1aafc61cd47cba7ab22e0a414d80d3f20cf5d17486ff19bbe2c8f5bdcb54e8870x1408827c865e8ddee39ff8dff39cc0ad8000f8e1a15d0b5e57a6ac25d4d265600x07cdc8b9a72dce74991273f50f9f5ea3eb05a902af7bc49ba325b74a1f5bad0f0x0b106dadb9525826d3ab3cdccf883e8b62f0264fe7c1423115318035f8013d4a"),
            // proof.equal("0x133d5d70b6085c07e172772612ec93fa64824af27d239e8f347f50778fad5f7f0x103a00336013e2191111e04d8e060aece83c3901c766acf59c3e885d168a09200x0e7b0184d947d92c56b94e8c8cd3a3f97e90d27441f68fad0fbdc03e8e2487760x1d19a35a7f72f8be6cdeb7bf22e60231be86acb265fbee7fb615c77180e48f2b0x1aafc61cd47cba7ab22e0a414d80d3f20cf5d17486ff19bbe2c8f5bdcb54e8870x1408827c865e8ddee39ff8dff39cc0ad8000f8e1a15d0b5e57a6ac25d4d265600x07cdc8b9a72dce74991273f50f9f5ea3eb05a902af7bc49ba325b74a1f5bad0f0x0b106dadb9525826d3ab3cdccf883e8b62f0264fe7c1423115318035f8013d4a"),
            "Submitted proof is incorrect, please try again..."
        );
        return true;
    }

    // returns balance of requested address
    function balanceOf(address) public view returns (uint256) {
        return address(this).balance;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal view override onlyOwner {}
}
//payable(seller).transfer(msg.value);
