import React, { useState, useEffect } from 'react';
import { ethers, Signer, Contract } from 'ethers';
import Web3 from 'web3';
const iotU_abi = require('./contract/IoTUpdate.json');

function App() { 

  const auction_abi = iotU_abi.abi;
  const bytecode = iotU_abi.bytecode;
  const [numBlocksUpdateOpen, setNumBlocksUpdateOpen] = useState(0);
  const [reward, setReward] = useState(0);
  const [isProofApproved, setIsProofApproved] = useState(false);
  const [isPoDSignatureGenerated, setIsPoDSignatureGenerated] = useState(false);
  const [isUpdateApplied, setIsUpdateApplied] = useState(false);
  const [manufacturer, setManufacturer] = useState('');
  const [distributor, setDistributor] = useState('-');
  const [iotDevice, setIoTDevice] = useState('-');

  const [connectedWallet, setConnectedAddress] = useState('')
  const [bal, setAddressBalance] = useState(0)
  const [contractAddress, setContractAddress] = useState("")
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [constructorArgs, setConstructorParameter] = useState({
    reservePrice: '',
    numBlocksAuctionOpen: '',
    offerPriceDecrement: '',
  })

  const [contractAddressForSearch, setContractAddressForSearch] = useState({
    'contractAddress1' : ''
  })

  const [bidAmount, setBidAmount] = useState(0);

  const [showReservePrice, setShowReservePrice] = useState(0);
  const [shownumBlock, setShowNumBlock] = useState(0);
  const [showOD, setShowOD] = useState(0);
  const [winningBid, setWinningBid] = useState(0);
  // const [signer1, setSigner] = useState("");

  // check connection to wallet
  const connect = () =>  {
    if(!window.ethereum)
      alert("Please install metamask extension")

    // connect wallet
    window.ethereum.request({method: 'eth_requestAccounts'})
    .then((result: any)=>{
      console.log('Connected address:',result);
      setConnectedAddress(result);
      setBalance(result);
      // setAuctionContractAddress(result);
      setIsWalletConnected(true);
      alert("Metamask wallet connected")
    })
    // function to get connected address's balance
    async function setBalance(connectedWallet:any){
    window.ethereum.request({
      method:'eth_getBalance',
      params:[String(connectedWallet), 'latest']
    }).then((balance : any) => {
      setAddressBalance(parseInt(ethers.utils.formatEther(balance)));
      // console.log(balance)
      console.log('ETH Balance:',ethers.utils.formatEther(balance))
    })
    .catch((error:any)=>console.log(error));
    }
    console.log('Metamask wallet connected');
  }

  const deployBasicDutchAuction = async() =>{
    console.log('Attempting to deploy auction...');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); 
    console.log('Provider and Signer created');
    const AuctionFactory = new ethers.ContractFactory(auction_abi, bytecode, signer);   
    console.log('AuctionFactory created: ',AuctionFactory);
    console.log('Parameters:',constructorArgs.reservePrice, constructorArgs.numBlocksAuctionOpen, constructorArgs.offerPriceDecrement);
    const AuctionToken = await AuctionFactory.deploy(constructorArgs.reservePrice, constructorArgs.numBlocksAuctionOpen, constructorArgs.offerPriceDecrement);
    console.log('Contract Address is: ',AuctionToken.address);
    setContractAddress(AuctionToken.address);
    await AuctionToken.deployed();
    console.log('Auction successfully deployed with requested parameters');
    let currentPrice = await AuctionToken.getCurrentPrice();
    setCurrentPrice(currentPrice.toNumber());
    setIsAuctionOpen(true);
  }

  const showInfo = async(e:any) =>{
    setIsAuctionOpen(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); 
    const contract = new ethers.Contract(contractAddressForSearch.contractAddress1, auction_abi, signer)
    console.log(seller);
    
    const sellerAdd = await contract.getSellerAddress();
    setSeller(sellerAdd);
    
    // const contAdd = await contract.getContractAddress();
    // setContractAddress(contAdd);

    const resPrice = await contract.getReservePrice();
    setShowReservePrice(parseInt(resPrice));
    const numBlock = await contract.getNumBlocksAuctionOpen();
    setShowNumBlock(parseInt(numBlock));
    const offerDec = await contract.getPriceDecrement();
    setShowOD(parseInt(offerDec));
    const currPrice = await contract.getCurrentPrice();
    setCurrentPrice(parseInt(currPrice,10));
    console.log('Auction State:',isAuctionOpen);
    console.log(contract)
    console.log('Contract Address:', contract.address);
    console.log('Current Price:',currentPrice);
    console.log('Parameters:',showReservePrice, shownumBlock, showOD);
  }
  
  const bid = async(e:any) =>{
    const bidAmount1 = document.getElementById('bidAmount') as HTMLInputElement;
    const bidVal = parseInt(bidAmount1.value);
    setBidAmount(bidVal);
    console.log('You have bid',bidVal);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); 
    const contract = new ethers.Contract(
      contractAddress, auction_abi, signer)

    // if(seller.bid({value: bidVal})){
    //   alert('Seller cannot bid on own item')
    // }

    if(bidVal > currentPrice){
      const tx = contract.bid({value: bidVal});
      setWinner(connectedWallet);
      setIsAuctionOpen(false);
      setWinningBid(bidVal);
      alert('Successful bid - You won the auction!')
      alert('Auction is now closed')
    }
    else if(bidVal < currentPrice)
      alert("Insufficient bid amount - please raise your bid to the current price");
    // else if(bidVal > bal)
    //   alert('Cannot bid more than you own')
  }

  const contractValueHandler = (e:any) => {
          setConstructorParameter({
            ...constructorArgs,
            [e.target.name]: e.target.value
          });
        };

  const contractAddressHandler = (e:any) => {
          setContractAddressForSearch({
            ...contractAddressForSearch,
            [e.target.name]: e.target.value
          });
        };

  // disconnect from wallet - work in progress
  const disconnect = () =>  {
    // ethereum.on('disconnect', handler: (error: ProviderRpcError) => void);
    // ethereum.on('accountsChanged', handler: (accounts: Array<string>) => void);
    // ethereum.on('chainChanged', handler: (chainId: string) => void);
      //   ethereum.on('chainChanged', (_chainId) => window.location.reload());
    }

  return (
    <div>
      <center>
      <h1>Basic Dutch Auction</h1>
      <div>
        <h2>
          <button onClick={connect}>Connect</button><br></br>
          <button disabled={!isWalletConnected} onClick={disconnect}>Disconnect</button>
        </h2>
          <p>Connected Wallet Address <br></br>{connectedWallet}</p>
          <p>Wallet Balance <br></br>{bal}</p>
          {/* <p>Contract Address <br></br>{contractAddress}</p> */}
      </div>

      <div>
        <h2>Deployment</h2>
        <input type = 'text' value = {constructorArgs.reservePrice} name = 'reservePrice' placeholder = "reserve price" onChange={contractValueHandler}/><br></br><br></br>
        <input type = 'text' value = {constructorArgs.numBlocksAuctionOpen} placeholder = "num blocks auction open" name = 'numBlocksAuctionOpen' onChange={contractValueHandler}/><br></br><br></br>
        <input type = 'text' value = {constructorArgs.offerPriceDecrement} placeholder = "offer price decrement" name = 'offerPriceDecrement' onChange={contractValueHandler}/><br></br><br></br>
        <button disabled={!isWalletConnected} onClick={deployBasicDutchAuction}>Deploy</button>
      </div>
      <div>
        <h2>Contract Address</h2>
        <label htmlFor="Contract Address"></label> <input type = 'text' name = 'contractAddress1' placeholder = "enter contract address" onChange={contractAddressHandler}/>
      </div>
      <div>
        <h2>Information</h2>
        <button onClick={showInfo}>Show Info</button>
          <p>Auction Open: {isAuctionOpen ? 'Yes' : 'No'}</p>
          <p>Contract Address: {contractAddress}</p>
          <p>Seller Address: {seller}</p>
          <p>Current Price: {currentPrice}</p>
          <p>Reserve Price: {showReservePrice}</p>
          <p>Number of Blocks Auction Open for: {shownumBlock}</p>
          <p>Price Decrement: {showOD}</p>
        <div>
        <h2>Bid</h2>
        <label htmlFor="Bid Amount"></label> <input type = 'text' defaultValue={bidAmount} id = 'bidAmount' placeholder = "enter bid" />
        
        <p></p>
        <button onClick={bid}>Bid</button>
        </div>
        <h2>Result</h2>
        <p>Current Price: {currentPrice}</p>
        <p>Current Bid: {bidAmount}</p>
        <p>Winning Bid: {winningBid}</p>
        <p>Winner: {winner ? winner : 'None'}</p>
        <p>Seller: {seller}</p>
        <p>Auction Open: {isAuctionOpen ? 'Yes' : 'No'}</p>
      </div>
      </center>
    </div>
  );
}

export default App;


// import './App.css';

// function App() {
//     return (
//         <h1>Hello World</h1>
//     );
// }

// export default App;
