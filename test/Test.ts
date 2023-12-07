import { ethers } from "hardhat";
import { assert, expect } from "chai";
import { IoTUpdate } from "../typechain-types";

describe("Deploy IoTUpdate Contract", () => {
  let IoTUpdateContract: IoTUpdate;
  let manufacturer: any;
  let distributor: any;
  let iotDevice: any;
  const blocks = 15n;
  const baseReward = 10n;

  beforeEach(async () => {
    [manufacturer] = await ethers.getSigners();
    [distributor] = await ethers.getSigners();
    [iotDevice] = await ethers.getSigners();
  });

  describe("Checking IoTUpdate Parameters", function(){
    it("console logging addresses", async function () {
      console.log("IoTUpdate Contract Address -",IoTUpdateContract);
      console.log("Manufacturer Address",manufacturer.address);
      console.log("Distributor(Account 1) Address -",distributor.address);
      console.log("IoT Device(Account 2) Address -",iotDevice.address);
    });

    it("should deploy and initialize the IoTUpdate contract", async () => {
      const IoTUpdateFactory = await ethers.getContractFactory("IoTUpdate");
      IoTUpdateContract = (await IoTUpdateFactory.connect(manufacturer).deploy(15)) as IoTUpdate;
    });

    it("should check if contract address exists", async () => {
      assert.exists(IoTUpdateContract.getAddress, "Contract address should exist");
      console.log("IoTUpdate Contract Address -",IoTUpdateContract.getAddress);
    });

    it("should check if number of blocks is initialized to 15", async () => {
      assert.equal(await IoTUpdateContract.getNumBlocksUpdateOpen(), blocks, "Number of blocks should be initialized to 15");
    });

    it("should check for base reward to be initialized to 10", async () => {
      assert.equal(await IoTUpdateContract.getBaseReward(), baseReward, "Base reward should be initialized to 10");
    });

    it("should check if owner address is set to manufacturers", async () => {
      assert.equal(await IoTUpdateContract.getManufacturerAddress(), manufacturer.address, "Owner should be set as the manufacturer");
    });

    it("should check if update is applied correctly", async () => {
      assert.isTrue(await IoTUpdateContract.isUpdateApplied(), "Update should be applied initially");
    });

    it("should check if proof approval is set correctly", async () => {
      assert.isTrue(await IoTUpdateContract.isProofApproved(), "Proof approval should be set to true initially");
    });

    it("should check if PoD signature generation is set correctly", async () => {
      assert.isTrue(await IoTUpdateContract.isPoDSignatureGenerated(), "PoD signature generation should be set to true initially");
    });
    // --------------------

    it("should reject updating without setting IoT device address", async () => {
      await expect(
        IoTUpdateContract.connect(iotDevice).test({
          value: ethers.parseEther("1.0"),
        })
      ).to.be.revertedWith("IoT device address must be set before update");
    });

    it("should check if distributor address is set correctly", async () => {
      await IoTUpdateContract.connect(manufacturer).setDistributorAddress(distributor.address);
      assert.equal(await IoTUpdateContract.getDistributorAddress(), distributor.address, "Distributor address should be set correctly");
    });

    

    it("should check if IoT device address is set correctly", async () => {
      await IoTUpdateContract.connect(manufacturer).setIoTDeviceAddress(iotDevice.address);
      assert.equal(await IoTUpdateContract.getIoTDeviceAddress(), iotDevice.address, "IoT device address should be set correctly");
    });

    
  });
  describe("test", function () {
    // Existing test cases...
  
    it("should reject updating if IoT device address is not set", async () => {
      await expect(
        IoTUpdateContract.connect(distributor).test({
          value: ethers.parseEther("1.0"),
        })
      ).to.be.revertedWith("IoT device address must be set before update");
    });
    it('num blocks update open for - 15' , async function(){
      expect(await IoTUpdateContract.getNumBlocksUpdateOpen()).to.equal(15);
    });
  
  });
  

  // Add more test cases as needed

});
