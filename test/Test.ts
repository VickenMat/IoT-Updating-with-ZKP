import { expect } from "chai";
import { ethers } from "hardhat";
// import { upgrades } from "hardhat";
import { assert } from "console";

describe("NFTTransfer Testing", function () {
  let manufacturer: any; // seller
  let distributor: any; // account1
  let iotDevice: any; // account2
  let nftTransferToken: any; // basicDutchAuctionToken

  /*
  describe("Contract Deployment", function(){
    it("deploys BasicDutchAuction.sol contract", async function () {
    });
  */
    beforeEach("deploys BasicDutchAuction.sol contract", async function () {
      const [owner, address1, address2] = await ethers.getSigners();
      seller = owner;
      account1 = address1;
      account2 = address2;
      const MintDutchAuctionFactory = await ethers.getContractFactory("BasicDutchAuction");
      const mintDutchAuction = await MintDutchAuctionFactory.deploy(100, 10, 10);
      basicDutchAuctionToken = await mintDutchAuction.deployed();
    });

    describe("Checking Auction Parameters", function(){
      it("console logging addresses", async function () {
        console.log("BasicDutchAuction Contract Address -",basicDutchAuctionToken.address);
        console.log("Seller Address -",seller.address);
        console.log("Winning Bidder(Account 1) Address -",account1.address);
        console.log("2nd Bidder(Account 2) Address -",account2.address);
      });
      it("initial price - 200 wei", async function () {
        expect(await basicDutchAuctionToken.getCurrentPrice()).to.equal(200);
      });
      it('reserve price - 100 wei' , async function(){
        expect(await basicDutchAuctionToken.getReservePrice()).to.equal(100);
      });
      it('num blocks auction open for - 10' , async function(){
        expect(await basicDutchAuctionToken.getNumBlocksAuctionOpen()).to.equal(10);
      });
      it('offer price decrement - 10 wei' , async function(){
        expect(await basicDutchAuctionToken.getPriceDecrement()).to.equal(10);
      });
      it('is auction open', async function(){
        expect(await basicDutchAuctionToken.isAuctionOpen()).to.be.true;
      })

      describe("Checking Seller/Bidder Address", function () {
        it('is owner of this contract the seller', async function(){
          expect(await basicDutchAuctionToken.getSellerAddress()).to.equal(seller.address);
        });
        it("is account1 wei balance greater than 0", async function () {
          expect(await basicDutchAuctionToken.balanceOf(account1.address)).to.lessThanOrEqual(0);
        });
        
        describe("Checking Bidders/Bidding", function(){
          it('bid from seller account', async function(){
            expect(basicDutchAuctionToken.connect(seller).bid({value: 200})).to.be.revertedWith("Owner cannot submit bid on own item");
          });
          it("bid rejected - 150 wei - insuffiecient amount", async function () {
            expect(basicDutchAuctionToken.connect(account1).bid({value: 150})).to.be.revertedWith("You have not sent sufficient funds");
          });
          it("bid accepted - 200 wei - sufficient amount", async function () {
            expect(basicDutchAuctionToken.connect(account1).bid({value: 200}))
          });
          it("multiple bids - first bid > current price - second bid < current price", async function () {
            expect(basicDutchAuctionToken.connect(account1).bid({value: 200}));
            expect(basicDutchAuctionToken.connect(account2).bid({value: 100}));
          });
          it("multiple bids - both bids > current price", async function () {
            expect(basicDutchAuctionToken.connect(account1).bid({value: 250}));
            expect(basicDutchAuctionToken.connect(account2).bid({value: 250}));
          });
          it('check for winner', async function(){
            expect( basicDutchAuctionToken.getWinnerAddress()).to.be.revertedWith('You are the winner');
          });
          it('auction ended - winner already chosen', async function(){
            const winner = account1;
            console.log(winner.address);
            expect(basicDutchAuctionToken.connect(account2).bid({value: 220}));
          });
          it('auction ended - reject bid because select number of blocks passed', async function(){
            expect( basicDutchAuctionToken.connect(account1).bid({value: 200})).to.be.revertedWith("Auction has closed - total number of blocks the auction is open for have passed")
          });
          it("Checking to see if the seller received the wei", async function () {
            expect(await basicDutchAuctionToken.balanceOf(seller.address)).to.equal(0);//(await basicDutchAuctionToken.getCurrentPrice());
          });
        });
      });
    });
  });