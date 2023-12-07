import { ethers } from "hardhat";
import { expect } from "chai";
import { MintPoDSignatureNFT } from "../typechain-types";

describe("MintPoDSignatureNFT Contract", () => {
  let MintPoDSignatureNFTContract: MintPoDSignatureNFT;
  let owner: any;
  const maxSupply = 1;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const MintPoDSignatureNFTFactory = await ethers.getContractFactory("MintPoDSignatureNFT");
    MintPoDSignatureNFTContract = (await MintPoDSignatureNFTFactory.deploy(maxSupply)) as MintPoDSignatureNFT;
    await MintPoDSignatureNFTContract.initialize(owner.address);
  });

  describe("Initialization", function () {
    it("should initialize with the correct max supply", async () => {
      expect(await MintPoDSignatureNFTContract.maxSupply()).to.equal(maxSupply);
    });

    it("should set the owner correctly", async () => {
      expect(await MintPoDSignatureNFTContract.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("should mint a PoD Signature NFT to the specified address", async () => {
      await MintPoDSignatureNFTContract.safeMint(owner.address);
      const ownerBalance = await MintPoDSignatureNFTContract.balanceOf(owner.address);
      expect(ownerBalance).to.equal(1);
    });

    it("should not mint more NFTs than the specified max supply", async () => {
      await MintPoDSignatureNFTContract.safeMint(owner.address);
      await expect(MintPoDSignatureNFTContract.safeMint(owner.address)).to.be.revertedWith(
        "Max number of PoD Signatures minted"
      );
    });
  });

  describe("Overrides", function () {
    // Add test cases for any other overridden functions if needed
    it("should support the ERC721 interface", async () => {
      const supportsERC721 = await MintPoDSignatureNFTContract.supportsInterface("0x80ac58cd"); // ERC721 interface ID
      expect(supportsERC721).to.be.true;
    });

    it("should support the ERC721Enumerable interface", async () => {
      const supportsERC721Enumerable = await MintPoDSignatureNFTContract.supportsInterface("0x780e9d63"); // ERC721Enumerable interface ID
      expect(supportsERC721Enumerable).to.be.true;
    });
  });
});
