import { ethers } from "hardhat";
import { expect } from "chai";
import { VToken } from "../typechain-types";

describe("VToken Contract", () => {
  let VTokenContract: VToken;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const VTokenFactory = await ethers.getContractFactory("VToken");
    VTokenContract = (await VTokenFactory.deploy(owner.address, 100000)) as VToken;
  });

  describe("Initialization", function () {
    it("should have the correct name and symbol", async () => {
      expect(await VTokenContract.name()).to.equal("VToken");
      expect(await VTokenContract.symbol()).to.equal("VTK");
    });

    it("should have the correct initial supply", async () => {
      const totalSupply = await VTokenContract.totalSupply();
      expect(totalSupply).to.equal(100);
    });

    it("should have the correct owner", async () => {
      expect(await VTokenContract.owner()).to.equal(owner.address);
    });

    it("should have the correct max supply", async () => {
      expect(await VTokenContract.maxSupply()).to.equal(100000);
    });
  });

  describe("Minting", function () {
    it("should allow the owner to mint tokens", async () => {
      await VTokenContract.connect(owner).mintERC20(addr1.address, 50);
      const balance = await VTokenContract.balanceOf(addr1.address);
      expect(balance).to.equal(50);
    });

    it("should not allow non-owners to mint tokens", async () => {
      await expect(VTokenContract.connect(addr1).mintERC20(addr2.address, 50)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("Token Burning", function () {
    it("should allow the owner to burn tokens", async () => {
      await VTokenContract.connect(owner).burn(50);
      const totalSupply = await VTokenContract.totalSupply();
      expect(totalSupply).to.equal(50);
    });

    it("should not allow non-owners to burn tokens", async () => {
      await expect(VTokenContract.connect(addr1).burn(50)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });
});
