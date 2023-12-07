// import { expect } from "chai";
// import { ethers } from "hardhat";
// // import { upgrades } from "hardhat";
// import { assert } from "console";

// describe("IoTUpdate Testing", function () {
//   let manufacturer: any; // seller
//   let distributor: any; // account1
//   let iotDevice: any; // account2
//   let basicIotUpdateToken: any; // basicDutchAuctionToken

//   /*
//   describe("Contract Deployment", function(){
//     it("deploys BasicDutchAuction.sol contract", async function () {
//     });
//   */
//     beforeEach("deploys IoTUpdate.sol contract", async function () {
//       const [owner, address1, address2] = await ethers.getSigners();
//       manufacturer = owner;
//       distributor = address1;
//       iotDevice = address2;
//       // const MintDutchAuctionFactory = await ethers.getContractFactory("BasicDutchAuction");
//       const MintIoTUpdateFactory = await ethers.getContractFactory("IoTUpdate");
//       // const mintDutchAuction = await MintDutchAuctionFactory.deploy(100, 10, 10);
//       const mintIoTUpdate = await MintIoTUpdateFactory.deploy(10);
//       // basicDutchAuctionToken = await mintDutchAuction.deployed();
//       basicIotUpdateToken = await mintIoTUpdate.deployed();
//     });

//     describe("Checking Auction Parameters", function(){
//       it("console logging addresses", async function () {
//         console.log("IoTUpdate Contract Address -",basicIotUpdateToken.getAddress); // used to be .address
//         console.log("Manufacturer Address -",manufacturer.address);
//         console.log("Distributor(Account 1) Address -",distributor.address);
//         console.log("IoT Device(Account 2) Address -",iotDevice.address);
//       });
//       it("initial price - 200 wei", async function () {
//         expect(await basicIotUpdateToken.getCurrentPrice()).to.equal(200);
//       });
//       it('reserve price - 100 wei' , async function(){
//         expect(await basicIotUpdateToken.getReservePrice()).to.equal(100);
//       });
//       it('num blocks auction open for - 10' , async function(){
//         expect(await basicIotUpdateToken.getNumBlocksAuctionOpen()).to.equal(10);
//       });
//       it('offer price decrement - 10 wei' , async function(){
//         expect(await basicIotUpdateToken.getPriceDecrement()).to.equal(10);
//       });
//       it('is auction open', async function(){
//         expect(await basicIotUpdateToken.isAuctionOpen()).to.be.true;
//       })

//       describe("Checking Seller/Bidder Address", function () {
//         it('is owner of this contract the seller', async function(){
//           expect(await basicIotUpdateToken.getSellerAddress()).to.equal(manufacturer.address);
//         });
//         it("is account1 wei balance greater than 0", async function () {
//           expect(await basicIotUpdateToken.balanceOf(distributor.address)).to.lessThanOrEqual(0);
//         });
        
//         describe("Checking Bidders/Bidding", function(){
//           it('bid from seller account', async function(){
//             expect(basicIotUpdateToken.connect(manufacturer).bid({value: 200})).to.be.revertedWith("Owner cannot submit bid on own item");
//           });
//           it("bid rejected - 150 wei - insuffiecient amount", async function () {
//             expect(basicIotUpdateToken.connect(distributor).bid({value: 150})).to.be.revertedWith("You have not sent sufficient funds");
//           });
//           it("bid accepted - 200 wei - sufficient amount", async function () {
//             expect(basicIotUpdateToken.connect(distributor).bid({value: 200}))
//           });
//           it("multiple bids - first bid > current price - second bid < current price", async function () {
//             expect(basicIotUpdateToken.connect(distributor).bid({value: 200}));
//             expect(basicIotUpdateToken.connect(iotDevice).bid({value: 100}));
//           });
//           it("multiple bids - both bids > current price", async function () {
//             expect(basicIotUpdateToken.connect(distributor).bid({value: 250}));
//             expect(basicIotUpdateToken.connect(iotDevice).bid({value: 250}));
//           });
//           it('check for winner', async function(){
//             expect( basicIotUpdateToken.getWinnerAddress()).to.be.revertedWith('You are the winner');
//           });
//           it('auction ended - winner already chosen', async function(){
//             const winner = distributor;
//             console.log(winner.address);
//             expect(basicIotUpdateToken.connect(iotDevice).bid({value: 220}));
//           });
//           it('auction ended - reject bid because select number of blocks passed', async function(){
//             expect( basicIotUpdateToken.connect(distributor).bid({value: 200})).to.be.revertedWith("Auction has closed - total number of blocks the auction is open for have passed")
//           });
//           it("Checking to see if the seller received the wei", async function () {
//             expect(await basicIotUpdateToken.balanceOf(manufacturer.address)).to.equal(0);//(await basicDutchAuctionToken.getCurrentPrice());
//           });
//         });
//       });
//     });
//   });