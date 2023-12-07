import { ethers } from "hardhat";
import { expect } from "chai";
import { VToken } from "../typechain-types";

describe("VToken Contract", () => {
  let vTokenContract: VToken;
  let owner: any;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const VTokenFactory = await ethers.getContractFactory("VToken");
    vTokenContract = (await VTokenFactory.deploy(owner.address, 100000)) as VToken;
  });

  describe("Initialization", function () {
    it("should initialize with the correct name and symbol", async () => {
      expect(await vTokenContract.name()).to.equal("VToken");
      expect(await vTokenContract.symbol()).to.equal("VTK");
    });

    it("should initialize with the correct max supply", async () => {
      expect(await vTokenContract.maxSupply()).to.equal(100000);
    });

    it("should set the owner correctly", async () => {
      expect(await vTokenContract.owner()).to.equal(owner.address);
    });

    it("should mint tokens to the initial owner during deployment", async () => {
      const ownerBalance = await vTokenContract.balanceOf(owner.address);
      expect(ownerBalance).to.equal(100);
    });

    it("should not set max supply above 100000", async () => {
      const VTokenFactoryAboveMax = await ethers.getContractFactory("VToken");
      await expect(VTokenFactoryAboveMax.deploy(owner.address, 100001)).to.be.revertedWith(
        "Max token supply must be less than or equal to 100000"
      );
    });

    it("should not set max supply to 0", async () => {
      const VTokenFactoryZeroSupply = await ethers.getContractFactory("VToken");
      await expect(VTokenFactoryZeroSupply.deploy(owner.address, 0)).to.be.revertedWith(
        "Max token supply must be greater than 0"
      );
    });
  });

  describe("Minting", function () {
    it("should allow the owner to mint tokens", async () => {
      await vTokenContract.mintERC20(owner.address, 50);
      const ownerBalance = await vTokenContract.balanceOf(owner.address);
      expect(ownerBalance).to.equal(150);
    });

    it("should not allow minting more tokens than the max supply", async () => {
      await expect(vTokenContract.mintERC20(owner.address, 100001)).to.be.revertedWith(
        "ERC20: mint amount exceeds max supply"
      );
    });
  });

  // Additional test cases can be added for permit functionality and other features

});
