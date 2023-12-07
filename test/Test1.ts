import { ethers } from "hardhat";
import { assert } from "chai";
import { IoTUpdate } from "../typechain-types";

describe("Deploy IoTUpdate Contract", () => {
  let IoTUpdateContract: IoTUpdate;
  let owner: any;
  const blocks = 15n;
  const baseReward = 10n;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
  });

  it("should deploy and initialize the IoTUpdate contract", async () => {
    const IoTUpdateFactory = await ethers.getContractFactory("IoTUpdate");
    IoTUpdateContract = (await IoTUpdateFactory.connect(owner).deploy(15)) as IoTUpdate;

    assert.exists(IoTUpdateContract.getAddress, "Contract address should exist");
    assert.equal(await IoTUpdateContract.getNumBlocksUpdateOpen(), blocks, "Number of blocks should be initialized to 100");
    assert.equal(await IoTUpdateContract.getBaseReward(), baseReward, "Base reward should be initialized to 10");
    assert.equal(await IoTUpdateContract.getManufacturerAddress(), owner.address, "Owner should be set as the manufacturer");
  });

  // Add more test cases as needed

});



// import { ethers, waffle } from "hardhat";
// import { assert } from "chai";
// import { IoTUpdate } from "../typechain-types";
// import { parseEther } from "ethers";

// declare var require: any

// // let ethers = require('./node_modules/ethers')
// // ethers.utils.formatUnits(balanceInWei, 18)
// // const { parseEther } = ethers.utils;
// const { provider, deployContract } = waffle;
// const blocks = 15n;
// const baseReward = 10n;

// describe("IoTUpdate Contract", () => {
//   let IoTUpdateContract: IoTUpdate;
//   let signers: any;

//   beforeEach(async () => {
//     signers = await ethers.getSigners();

//     IoTUpdateContract = (await deployContract(signers[0], "IoTUpdate", [100])) as IoTUpdate;
//   });

//   it("should deploy and initialize correctly", async () => {
//     assert.exists(IoTUpdateContract.getAddress, "Contract address should exist");
//     assert.equal(await IoTUpdateContract.getNumBlocksUpdateOpen(), blocks, "Number of blocks should be initialized to 100");
//     assert.equal(await IoTUpdateContract.getBaseReward(), baseReward, "Base reward should be initialized to 10");
//   });

//   it("should successfully update IoT device and transfer funds to distributor", async () => {
//     const manufacturerAddress = signers[0].address;
//     const distributorAddress = signers[1].address;
//     const iotDeviceAddress = signers[2].address;

//     await IoTUpdateContract.connect(signers[0]).test({
//       value: parseEther("1.0"),
//     });

//     assert.equal(await IoTUpdateContract.getDistributorAddress(), distributorAddress, "Distributor address should be set");
//     assert.equal(await IoTUpdateContract.isUpdateApplied(), false, "Update should be marked as applied");
//     assert.equal(await provider.getBalance(distributorAddress), parseEther("1.0"), "Distributor should receive funds");
//   });

//   // Add more test cases as needed

// });
