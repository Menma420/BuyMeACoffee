# Buy Me A Coffee ☕ dApp

A decentralized application (dApp) that allows users to send ETH tips ("coffees") and leave messages on the blockchain. Built with React, Solidity, and ethers.js.

![image](https://github.com/user-attachments/assets/ae981c57-d203-497e-9b8b-b6d89eccc3cd)
![image](https://github.com/user-attachments/assets/ea9646d7-7e2d-4355-b1a0-07c029ea92e2)
![image](https://github.com/user-attachments/assets/0a75dd67-ea8f-4805-85b6-6a5376f1a352)


## Features 🌟
- Connect MetaMask wallet to interact with the dApp
- Send 0.001 ETH with a personalized message
- View all historical messages and senders
- Contract owner can withdraw accumulated tips
- Real-time updates using Ethereum event listeners
- Read-only mode (no wallet needed to view messages)

## Technologies Used 🛠️
- **Frontend**: React.js
- **Smart Contract**: Solidity (ERC-20 compatible)
- **Blockchain Interaction**: ethers.js v6
- **Ethereum Provider**: Alchemy API
- **Network**: Ethereum Sepolia Testnet

## Getting Started 🚀

### Prerequisites
- Node.js v16+
- MetaMask wallet (with Sepolia test ETH)
- Alchemy API key ([Get Free Key](https://dashboard.alchemy.com/))

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/Menma420/BuyMeACoffee.git
   cd BuyMeACoffee
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create `.env` file in frontend as well as root folder:
   ```
   REACT_APP_ALCHEMY_API_KEY=your_alchemy_key_here
   PRIVATE_KEY=your_wallet_private_key_here
   ```
4. Start development server:
   ```
   npm start
   ```

## Usage Guide 📖
1. **Connect Wallet**  
   Click "Connect Wallet" to link your MetaMask (ensure you're on Sepolia testnet)
   
2. **Buy Coffee**  
   - Enter your name (optional)
   - Write a message
   - Click "Send 0.001 ETH"

3. **View Messages**  
   All historical messages automatically appear in read-only mode

4. **Withdraw Tips (Owner Only)**  
   The contract owner can withdraw accumulated ETH to their wallet

## Smart Contract Details 📜
**Contract Address**: `0x3f039512f30674852A3B778B711eb73062a36370`  
**Features**:
- Stores messages permanently on blockchain
- Ensures minimum 0.001 ETH per coffee
- Withdraw security check for owner
- Event emission for real-time updates

---

**Note**: This dApp uses the Sepolia testnet. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/).
