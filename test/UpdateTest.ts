import { ethers } from "hardhat";
import { expect } from "chai";
import { MintUpdateNFT } from "../typechain-types";

describe("MintUpdateNFT Contract", () => {
  let MintUpdateNFTContract: MintUpdateNFT;
  let owner: any;
  const maxSupply = 5;
  const proof = "0x133d5d70b6085c07e172772612ec93fa64824af27d239e8f347f50778fad5f7f0x103a00336013e2191111e04d8e060aece83c3901c766acf59c3e885d168a09200x0e7b0184d947d92c56b94e8c8cd3a3f97e90d27441f68fad0fbdc03e8e2487760x1d19a35a7f72f8be6cdeb7bf22e60231be86acb265fbee7fb615c77180e48f2b0x1aafc61cd47cba7ab22e0a414d80d3f20cf5d17486ff19bbe2c8f5bdcb54e8870x1408827c865e8ddee39ff8dff39cc0ad8000f8e1a15d0b5e57a6ac25d4d265600x07cdc8b9a72dce74991273f50f9f5ea3eb05a902af7bc49ba325b74a1f5bad0f0x0b106dadb9525826d3ab3cdccf883e8b62f0264fe7c1423115318035f8013d4a";
  const proof1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const MintUpdateNFTFactory = await ethers.getContractFactory("MintUpdateNFT");
    MintUpdateNFTContract = (await MintUpdateNFTFactory.deploy(5)) as MintUpdateNFT;
  });

  describe("Initialization", function () {
    it("should initialize with the correct max supply", async () => {
      expect(await MintUpdateNFTContract.maxSupply()).to.equal(maxSupply);
    });

    it("should set the owner correctly", async () => {
      expect(await MintUpdateNFTContract.owner()).to.equal(owner.address);
    });
  });
  describe("Minting with ZKP", function () {
    // NOT WORKING
    it("should mint an NFT with correct ZKP proof", async () => {
      // Mock ZKP proof (replace with actual proof)
      await expect(MintUpdateNFTContract.safeMint(owner.address, proof))
        .to.emit(MintUpdateNFTContract, "ZKPVerified")
        .withArgs(owner.address, 0);
    });
    // NOT WORKING
    it("should fail to mint an NFT with incorrect ZKP proof", async () => {
      // Mock incorrect ZKP proof (replace with an invalid proof)
      const invalidProof = "invalidZKPProof";

      await expect(MintUpdateNFTContract.safeMint(owner.address, invalidProof)).to.be.revertedWith(
        "ZKP verification failed"
      );
    });

    it("should fail to mint more NFTs than the max supply", async () => {
      const maxSupply = 3;
      const MintUpdateNFTContractLimited = await ethers.getContractFactory("MintUpdateNFT");
      const MintUpdateNFTContractLimitedInstance = (await MintUpdateNFTContractLimited.deploy(maxSupply)) as MintUpdateNFT;

      // Minting within the limit
      for (let i = 0; i < maxSupply; i++) {
        await MintUpdateNFTContractLimitedInstance.safeMint(owner.address, proof);
      }

      // Attempting to mint beyond the limit should fail
      await expect(MintUpdateNFTContractLimitedInstance.safeMint(owner.address, proof)).to.be.revertedWith(
        "Max number of Update File NFTs minted"
      );
    });
  });
    

  describe("Minting", function () {
    it("should mint an Update File NFT to the specified address", async () => {
      await MintUpdateNFTContract.safeMint(owner.address, proof);
      const ownerBalance = await MintUpdateNFTContract.balanceOf(owner.address);
      expect(ownerBalance).to.equal(1);
    });

    it("should not mint more NFTs than the specified max supply", async () => {
      for (let i = 0; i < maxSupply; i++) {
        await MintUpdateNFTContract.safeMint(owner.address, proof);
      }
      await expect(MintUpdateNFTContract.safeMint(owner.address, proof)).to.be.revertedWith(
        "Max number of Update File NFTs minted"
      );
    });
    // NOT WORKING
    it("should not mint NFTs if max supply is set to 0", async () => {
      const MintUpdateNFTContractZeroSupply = await ethers.getContractFactory("MintUpdateNFT");
      const MintUpdateNFTContractZeroSupplyInstance = (await MintUpdateNFTContractZeroSupply.deploy(0)) as MintUpdateNFT;
      await MintUpdateNFTContractZeroSupplyInstance.initialize(owner.address);

      await expect(MintUpdateNFTContractZeroSupplyInstance.safeMint(owner.address, proof)).to.be.revertedWith(
        "Max number of Update File NFTs must be greater than 0"
      );
    });
    // NOT WORKING
    it("should not mint NFTs if max supply is set above 5", async () => {
      const MintUpdateNFTContractAboveMax = await ethers.getContractFactory("MintUpdateNFT");
      const MintUpdateNFTContractAboveMaxInstance = (await MintUpdateNFTContractAboveMax.deploy(6)) as MintUpdateNFT;
      await MintUpdateNFTContractAboveMaxInstance.initialize(owner.address);

      await expect(MintUpdateNFTContractAboveMaxInstance.safeMint(owner.address, proof)).to.be.revertedWith(
        "Max number of Update File NFTs must be less than or equal to 5"
      );
    });
    
  });
  describe("Overrides", function () {
    // Add test cases for any other overridden functions if needed
    it("should support the ERC721 interface", async () => {
      const supportsERC721 = await MintUpdateNFTContract.supportsInterface("0x80ac58cd"); // ERC721 interface ID
      expect(supportsERC721).to.be.true;
    });

    it("should support the ERC721Enumerable interface", async () => {
      const supportsERC721Enumerable = await MintUpdateNFTContract.supportsInterface("0x780e9d63"); // ERC721Enumerable interface ID
      expect(supportsERC721Enumerable).to.be.true;
    });
  });
});



//     // MORE NEW ZKP
//     describe("MintingZKP NEW", function () {
//       it("should mint an NFT with correct ZKP proof", async () => {
//         // Mock ZKP proof (replace with actual proof)
//         const proof = "mockZKPProof";
  
//         await expect(MintUpdateNFTContract.safeMint(owner.address, proof))
//           .to.emit(MintUpdateNFTContract, "ZKPVerified")
//           .withArgs(owner.address, 0);
  
//         const ownerBalance = await MintUpdateNFTContract.balanceOf(owner.address);
//         expect(ownerBalance).to.equal(1);
//       });
  
//       it("should fail to mint an NFT with incorrect ZKP proof", async () => {
//         // Mock incorrect ZKP proof (replace with an invalid proof)
//         const invalidProof = "invalidZKPProof";
  
//         await expect(MintUpdateNFTContract.safeMint(owner.address, invalidProof)).to.be.revertedWith(
//           "ZKP verification failed"
//         );
//         const ownerBalance = await MintUpdateNFTContract.balanceOf(owner.address);
//       expect(ownerBalance).to.equal(0);
//     });
//   });

//     // ZKP Verification
//     it("should not mint NFTs without a valid ZKP", async () => {
//       await expect(MintUpdateNFTContract.verifyZKP(1, "invalidProof")).to.be.revertedWith(
//         "ZKP verification failed"
//       );
//     });
    
//     it("should mint NFTs with a valid ZKP", async () => {
//       // Mock a valid ZKP proof (replace with actual proof generation logic)
//       const validZKPProof = "validProof";

//       // Mint a new NFT
//       await MintUpdateNFTContract.safeMint(owner.address);

//       // Get the tokenId of the minted NFT
//       const tokenId = await MintUpdateNFTContract.tokenOfOwnerByIndex(owner.address, 0);

//       // Verify ZKP
//       await MintUpdateNFTContract.verifyZKP(tokenId, validZKPProof);

//       // Ensure ZKPVerified event was emitted
//       const events = await MintUpdateNFTContract.queryFilter(
//         'ZKPVerified',
//         MintUpdateNFTContract.filters.ZKPVerified()
//       );
//       expect(events.length).to.equal(1);
//       expect(events[0].args?.owner).to.equal(owner.address);
//       expect(events[0].args?.tokenId).to.equal(tokenId);
//     });
//     // ZKP Verification ends
//   });


