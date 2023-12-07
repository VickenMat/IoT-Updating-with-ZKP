import { ethers } from "hardhat";
import { expect } from "chai";
import { MintUpdateNFT } from "../typechain-types";

describe("MintUpdateNFT Contract", () => {
  let MintUpdateNFTContract: MintUpdateNFT;
  let owner: any;
  const maxSupply = 5;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const MintUpdateNFTFactory = await ethers.getContractFactory("MintUpdateNFT");
    MintUpdateNFTContract = (await MintUpdateNFTFactory.deploy(maxSupply)) as MintUpdateNFT;
    await MintUpdateNFTContract.initialize(owner.address);
  });

  describe("Initialization", function () {
    it("should initialize with the correct max supply", async () => {
      expect(await MintUpdateNFTContract.maxSupply()).to.equal(maxSupply);
    });

    it("should set the owner correctly", async () => {
      expect(await MintUpdateNFTContract.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("should mint an Update File NFT to the specified address", async () => {
      await MintUpdateNFTContract.safeMint(owner.address);
      const ownerBalance = await MintUpdateNFTContract.balanceOf(owner.address);
      expect(ownerBalance).to.equal(1);
    });

    it("should not mint more NFTs than the specified max supply", async () => {
      for (let i = 0; i < maxSupply; i++) {
        await MintUpdateNFTContract.safeMint(owner.address);
      }
      await expect(MintUpdateNFTContract.safeMint(owner.address)).to.be.revertedWith(
        "Max number of Update File NFTs minted"
      );
    });

    it("should not mint NFTs if max supply is set to 0", async () => {
      const MintUpdateNFTContractZeroSupply = await ethers.getContractFactory("MintUpdateNFT");
      const MintUpdateNFTContractZeroSupplyInstance = (await MintUpdateNFTContractZeroSupply.deploy(0)) as MintUpdateNFT;
      await MintUpdateNFTContractZeroSupplyInstance.initialize(owner.address);

      await expect(MintUpdateNFTContractZeroSupplyInstance.safeMint(owner.address)).to.be.revertedWith(
        "Max number of Update File NFTs must be greater than 0"
      );
    });

    it("should not mint NFTs if max supply is set above 5", async () => {
      const MintUpdateNFTContractAboveMax = await ethers.getContractFactory("MintUpdateNFT");
      const MintUpdateNFTContractAboveMaxInstance = (await MintUpdateNFTContractAboveMax.deploy(6)) as MintUpdateNFT;
      await MintUpdateNFTContractAboveMaxInstance.initialize(owner.address);

      await expect(MintUpdateNFTContractAboveMaxInstance.safeMint(owner.address)).to.be.revertedWith(
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
