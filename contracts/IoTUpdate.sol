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
    uint256 public baseReward = 10;
    uint256 public numBlocksUpdateOpen;
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

    uint256 nftTokenID = 0;
    address erc721TokenAddress;
    address erc20TokenAddress;
    IMintNFT mintNFT; // initializes interface to mintNFT
    IMintERC20 mintERC20;

    function initialize(
        address _erc20TokenAddress,
        address _erc721TokenAddress,
        uint256 _nftTokenID,
        uint256 _numBlocksUpdateOpen
    ) public initializer {
        // __Ownable_init();
        __UUPSUpgradeable_init();

        numBlocksUpdateOpen = _numBlocksUpdateOpen;
        manufacturer = msg.sender;
        reward = (baseReward / numBlocksUpdateOpen) * 100;
        blockStart = block.number;

        erc721TokenAddress = _erc721TokenAddress;
        nftTokenID = _nftTokenID;
        erc20TokenAddress = _erc20TokenAddress;
        mintERC20 = IMintERC20(erc20TokenAddress);
        mintNFT = IMintNFT(erc721TokenAddress);
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

    function setManufacturerAddress(address _manufacturer) public {
        manufacturer = _manufacturer;
    }

    // Begin ZKP verification
    function verifyZKP(uint256 tokenId, string memory proof) external {
        require(
            msg.sender == manufacturer,
            "Only the manufacturer can verify the ZKP"
        );
        // Call an external ZKP verification function or contract
        require(_verifyZKP(tokenId, proof), "ZKP verification failed");
        // Emit an event or perform any action upon successful verification
        emit ZKPVerified(distributor, tokenId);
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
        require(
            block.number - blockStart <= numBlocksUpdateOpen,
            "Max block number exceeded - Update window has closed - Please try again"
        );
        //IoT device completes the update internally and sets isUpdateApplied to true
        isUpdateApplied = true;
        console.log("IoT Device now owns the update file and encryption key!");
        console.log("Update successful!");
        return iotDevice;
    }

    // Function which allows manufacturer to pay distributor their rewards
    function payout() public payable returns (address) {
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
            "You have bid more tokens than you own"
        );

        // TEST WITH ONLY LINE BELOW
        mintERC20.transferFrom(manufacturer, distributor, reward);
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
        require(
            mintNFT.balanceOf(msg.sender) >= 0,
            "You do not have any transferrable NFTs"
        );
        // END NEW
        mintNFT.safeTransferFrom(manufacturer, distributor, nftTokenID); // transfer nft from seller to winner based on its id
        return distributor;
    }

    // CHECKS AMOUNT OF NFTS OWNED BY CERTAIN ADDRESS
    // function updateNFTBalance(address owner) public (uint256){

    // }

    // Internal function to perform the actual ZKP verification
    function _verifyZKP(
        uint256 tokenId,
        string memory proof
    ) internal view returns (bool) {
        // Call external contract and validate proof against the provided parameters
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

// import "hardhat/console.sol";
// import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// pragma solidity >=0.8.19 <=0.8.23;

// contract IoTUpdate is OwnableUpgradeable {
//     uint256 public immutable baseReward = 10;
//     uint256 public immutable numBlocksUpdateOpen;
//     uint256 blockStart;
//     uint256 public reward;
//     address public manufacturer;
//     address public distributor;
//     address public iotDevice;
//     bool public isProofApproved = false;
//     bool public isPoDSignatureGenerated = false;
//     bool public isUpdateApplied = false;
//     bool public isDistributorPayed = false;
//     string proof =
//         "0x133d5d70b6085c07e172772612ec93fa64824af27d239e8f347f50778fad5f7f0x103a00336013e2191111e04d8e060aece83c3901c766acf59c3e885d168a09200x0e7b0184d947d92c56b94e8c8cd3a3f97e90d27441f68fad0fbdc03e8e2487760x1d19a35a7f72f8be6cdeb7bf22e60231be86acb265fbee7fb615c77180e48f2b0x1aafc61cd47cba7ab22e0a414d80d3f20cf5d17486ff19bbe2c8f5bdcb54e8870x1408827c865e8ddee39ff8dff39cc0ad8000f8e1a15d0b5e57a6ac25d4d265600x07cdc8b9a72dce74991273f50f9f5ea3eb05a902af7bc49ba325b74a1f5bad0f0x0b106dadb9525826d3ab3cdccf883e8b62f0264fe7c1423115318035f8013d4a";
//     // ZKP Verification Event
//     event ZKPVerified(address indexed owner, uint256 tokenId);

//     modifier onlyManufacturer() {
//         require(msg.sender == manufacturer, "Ownable: caller is not the owner");
//         _;
//     }

//     constructor(uint256 _numBlocksUpdateOpen) {
//         numBlocksUpdateOpen = _numBlocksUpdateOpen;
//         manufacturer = msg.sender;
//         reward = (baseReward / numBlocksUpdateOpen) * 100;
//         blockStart = block.number;
//     }

//     function getReward() public view returns (uint256) {
//         return reward;
//     }

//     function getAddress() public view returns (address) {
//         return address(this);
//     }

//     function getNumBlocksUpdateOpen() public view returns (uint256) {
//         return numBlocksUpdateOpen;
//     }

//     function getCurrentBlock() public view returns (uint256) {
//         return block.number;
//     }

//     function getBaseReward() public pure returns (uint256) {
//         return 10;
//     }

//     function getManufacturerAddress() public view returns (address) {
//         return manufacturer;
//     }

//     function getDistributorAddress() public view returns (address) {
//         return distributor;
//     }

//     function getIoTDeviceAddress() public view returns (address) {
//         return iotDevice;
//     }

//     function setDistributorAddress(
//         address _distributor
//     ) public onlyManufacturer {
//         distributor = _distributor;
//     }

//     function setIoTDeviceAddress(address _iotDevice) public onlyManufacturer {
//         iotDevice = _iotDevice;
//     }

//     function verifyZKP(
//         uint256 tokenId,
//         // Add other proof parameters as needed
//         // For simplicity, assuming `proof` is a bytes array
//         string memory proof
//     ) external {
//         require(
//             msg.sender == manufacturer,
//             "Only the manufacturer can verify the ZKP"
//         );
//         // Call an external ZKP verification function or contract
//         require(_verifyZKP(tokenId, proof), "ZKP verification failed");

//         // Emit an event or perform any action upon successful verification
//         emit ZKPVerified(distributor, tokenId);
//         isProofApproved = true;
//         isPoDSignatureGenerated = true;
//         console.log("ZKP Verified!");
//         console.log("Proof of Delivery Signature generated by the IoT device!");
//         console.log("Please begin the update process!");
//     }

//     function update() public returns (address) {
//         require(
//             isPoDSignatureGenerated,
//             "Proof of Delivery Signature must be generated!"
//         );
//         require(isProofApproved, "Proof has not been approved yet!");
//         require(
//             isUpdateApplied == false,
//             "Device is currently up to date with the latest firmware!"
//         );
//         require(
//             iotDevice != address(0),
//             "IoT device address must be set before update"
//         );
//         require(
//             distributor != address(1),
//             "Distributor address must be set before update"
//         );
//         require(msg.sender == iotDevice, "IoT Device must be the one updating");
//         require(
//             block.number - blockStart <= numBlocksUpdateOpen,
//             "Max block number exceeded - Update window has closed - Please try again"
//         );

//         isUpdateApplied = true;
//         console.log("IoT Device now owns the update file and encryption key!");
//         console.log("Update successful!");

//         return iotDevice;
//     }

//     function payout() public payable returns (address) {
//         require(
//             isPoDSignatureGenerated,
//             "Proof of Delivery Signature must be generated!"
//         );
//         require(isProofApproved, "Proof has not been approved yet!");
//         require(
//             isUpdateApplied,
//             "Device is currently up to date with the latest firmware!"
//         );
//         require(
//             manufacturer.balance > 0,
//             "Manufacturers account balance is not greater than 0"
//         );
//         require(
//             msg.sender == manufacturer,
//             "Manufacturer must be the one sending the payout to the distributor"
//         );
//         payable(distributor).transfer(msg.value);
//         isDistributorPayed = true;
//         console.log(
//             "Manufacturer has paid the distributer ",
//             reward,
//             "VTokens"
//         );
//         return (distributor);
//     }

//     // returns balance of requested address
//     function balanceOf(address) public view returns (uint256) {
//         return address(this).balance;
//     }

//     // Begin ZKP Login/Functions
//     // Function to verify zero-knowledge proof
//     // THIS BREAK THE TESTING FOR VTOKEN

//     // Internal function to perform the actual ZKP verification
//     function _verifyZKP(
//         uint256 tokenId,
//         string memory proof
//     ) internal view returns (bool) {
//         // Implement your ZKP verification logic here
//         // This might involve calling an external contract or service
//         // and validating the proof against the provided parameters
//         // Return true if the verification succeeds, false otherwise
//         // For simplicity, always returning true in this example
//         return true;
//     }

//     // End ZKP Verification
// }
