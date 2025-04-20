const hre = require("hardhat");

async function main() {
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();

  // Wait until the contract is fully deployed
  await buyMeACoffee.waitForDeployment();

  const address = await buyMeACoffee.getAddress();
  console.log("✅ Contract deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
