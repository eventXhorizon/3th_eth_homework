
const hre = require("hardhat");

// const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const SEPOLIA_URL = process.env.SEPOLIA_URL;
// const providerSepolia = new hre.ethers.providers.JsonRpcProvider(SEPOLIA_URL);
// let wallet = new hre.ethers.Wallet(PRIVATE_KEY, providerSepolia);


async function main() {
  const ERC20Homework = await hre.ethers.getContractFactory("ERC20Homework");
  const contract = await ERC20Homework.deploy();
  await contract.deployed();

  const addr = contract.address;

  console.log(
      `MyToken address deploy to ${addr}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
