import { ethers } from "hardhat";
import { expect } from "chai";
import { MintEncryptionKeyNFT } from "../typechain-types";

describe("MintEncryptionKeyNFT Contract", () => {
  let MintEncryptionKeyNFTContract: MintEncryptionKeyNFT;
  let owner: any;
  const maxSupply = 1;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const MintEncryptionKeyNFTFactory = await ethers.getContractFactory("MintEncryptionKeyNFT");
    MintEncryptionKeyNFTContract = (await MintEncryptionKeyNFTFactory.deploy(maxSupply)) as MintEncryptionKeyNFT;
    await MintEncryptionKeyNFTContract.initialize(owner.address);
  });

  describe("Initialization", function () {
    it("should initialize with the correct max supply", async () => {
      expect(await MintEncryptionKeyNFTContract.maxSupply()).to.equal(maxSupply);
    });

    it("should set the owner correctly", async () => {
      expect(await MintEncryptionKeyNFTContract.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("should mint an Encryption Key NFT to the specified address", async () => {
      await MintEncryptionKeyNFTContract.safeMint(owner.address);
      const ownerBalance = await MintEncryptionKeyNFTContract.balanceOf(owner.address);
      expect(ownerBalance).to.equal(1);
    });

    it("should not mint more NFTs than the specified max supply", async () => {
      await MintEncryptionKeyNFTContract.safeMint(owner.address);
      await expect(MintEncryptionKeyNFTContract.safeMint(owner.address)).to.be.revertedWith(
        "Max number of Encryption Keys minted"
      );
    });
  });

  describe("Overrides", function () {
    // Add test cases for any other overridden functions if needed
    it("should support the ERC721 interface", async () => {
      const supportsERC721 = await MintEncryptionKeyNFTContract.supportsInterface("0x80ac58cd"); // ERC721 interface ID
      expect(supportsERC721).to.be.true;
    });

    it("should support the ERC721Enumerable interface", async () => {
      const supportsERC721Enumerable = await MintEncryptionKeyNFTContract.supportsInterface("0x780e9d63"); // ERC721Enumerable interface ID
      expect(supportsERC721Enumerable).to.be.true;
    });
  });
});
