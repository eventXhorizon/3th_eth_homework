require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const GOERLI_URL = process.env.GOERLI_URL;
const ETHERSCAN_API = process.env.ETHERSCAN_API;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY]
    },
    goerli: {
      url: GOERLI_URL,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API
  }
};
