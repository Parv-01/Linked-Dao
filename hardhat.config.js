require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    "celo-alfajores": {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 64) ? [`0x${process.env.PRIVATE_KEY}`] : [],
      chainId: 44787
    },
    "celo-sepolia": {
      url: "https://forno.celo-sepolia.celo-testnet.org",
      accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 64) ? [`0x${process.env.PRIVATE_KEY}`] : [],
      chainId: 11142220
    }
  }
};
