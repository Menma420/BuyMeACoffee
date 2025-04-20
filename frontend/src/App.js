import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./BuyMeACoffeeABI.json";
import "./App.css";

const contractAddress = "0x3f039512f30674852A3B778B711eb73062a36370";

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [contract, setContract] = useState(null);
  const [memos, setMemos] = useState([]);
  const [owner, setOwner] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [provider, setProvider] = useState(null);


  useEffect(() => {
    const fetchBalance = async () => {
      if (!provider) return;
      const bal = await provider.getBalance(contractAddress);
      setBalance(ethers.formatEther(bal));
    };
    
    if (contract) fetchBalance();
  }, [contract, memos, provider, contractAddress]);
  

  useEffect(() => {
    loadContractReadOnly();
  }, []);
  
  useEffect(() => {
    if (!contract) return;
    const handler = (from, name, message, timestamp) => {
      setMemos(prev => [
        ...prev,
        { from, name, message, timestamp }
      ]);
    };
    contract.on("NewMemo", handler);
    return () => contract.off("NewMemo", handler);
  }, [contract]);
  
  
  const loadContractReadOnly = async () => {
    try {
      console.log("Starting loadContractReadOnly");
      console.log("API Key exists:", Boolean(process.env.REACT_APP_ALCHEMY_API_KEY));

      const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`); 
      console.log("Provider created");
      
      // Test provider connection
      const blockNumber = await provider.getBlockNumber();
      console.log("Connected to network, block:", blockNumber);
      
      setProvider(provider);
      
      const coffeeContract = new ethers.Contract(contractAddress, abi.abi, provider);
      console.log("Contract created");
      
      const memos = await coffeeContract.getMemos();
      console.log("Memos fetched:", memos, "Length:", memos.length);
      
      setMemos(memos);
      
      const contractOwner = await coffeeContract.owner();
      console.log("Owner fetched:", contractOwner);
      
      setOwner(contractOwner);
      
      // Fetch balance immediately after setting provider
      const bal = await provider.getBalance(contractAddress);
      console.log("Balance:", ethers.formatEther(bal));
      setBalance(ethers.formatEther(bal));
      
    } catch (err) {
      console.error("Failed to load memos in read-only mode:", err);
      alert("Failed to load initial data. See console for details.");
    }
  };
  
  

  const getMemos = async () => {
    if (contract) {
      try {
        const memos = await contract.getMemos();
        setMemos(memos);
      } catch (err) {
        console.error("Error fetching memos:", err);
      }
    }
  };
  

  const connectWallet = async () => {
    try {
      // 1. Check for MetaMask
      if (!window.ethereum) {
        alert("🦊 Please install MetaMask to use this app!");
        return;
      }
  
      // 2. Create provider and request accounts
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      setProvider(provider);
  
      // 3. Check for Sepolia network (chainId: 11155111)
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== 11155111) {
        alert("Please switch your wallet to Sepolia testnet!");
        return;
      }
  
      // 4. Get signer and contract instance
      const signer = await provider.getSigner();
      const coffeeContract = new ethers.Contract(contractAddress, abi.abi, signer);
  
      // 5. Get user and owner addresses
      const userAddress = await signer.getAddress();
      const contractOwner = await coffeeContract.owner();
  
      // 6. Update state
      setCurrentAccount(userAddress);
      setOwner(contractOwner);
      setContract(coffeeContract);
      setWalletConnected(true);
  
      // 7. Fetch and set memos
      const memos = await coffeeContract.getMemos();
      setMemos(memos);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("⚠️ Wallet connection failed. Please try again.");
    }
  };
  
  

  const buyCoffee = async () => {
    if (!contract) return;
    try {
      const txn = await contract.buyCoffee(
        name || "Anonymous",
        message || "Enjoy your coffee!",
        { value: ethers.parseEther("0.001") }
      );
      await txn.wait();
      alert("☕ Coffee sent!");
      setName("");
      setMessage("");
      await getMemos(); 
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };
  

  const withdrawTips = async () => {
    if (!contract) return;
    try {
      const txn = await contract.withdrawTips();
      await txn.wait();
      alert("💸 Tips withdrawn to your wallet!");
    } catch (err) {
      console.error("Withdrawal failed:", err);
      alert("⚠️ Only the contract owner can withdraw.");
    }
  };
  

  return (
    <div className="container">
      <h1>Buy Me a Coffee ☕</h1>

      {owner && (
        <p>
          👑 Tips go to: <strong>{owner}</strong>
        </p>
      )}


      {!walletConnected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <br />
          <textarea
            placeholder="Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <br />
          <button onClick={buyCoffee}>Send 0.001 ETH</button>
        </div>
      )}
      <hr style={{ margin: "2rem 0" }} />
<h2>Messages:</h2>
{memos.length === 0 ? (
  <p>No coffees yet!</p>
) : (
  memos.map((memo, idx) => (
    <div
      key={idx}
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "8px",
      }}
    >
      <p>
        <strong>{memo.name}</strong> at{" "}
        {new Date(Number(memo.timestamp) * 1000).toLocaleString()}
      </p>
      <p>{memo.message}</p>
      <small>
        <i>From: {memo.from}</i>
      </small>
    </div>
  ))
)}

  {currentAccount === owner && (
    <>
      <br />
      <button onClick={withdrawTips}>Withdraw Tips (Owner Only)</button>
    </>
  )}

  <p>☕ Contract Balance: <strong>{balance}</strong> ETH</p>



    </div>
  );
}

export default App;
