const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const iSai = await hre.ethers.getContractFactory("iSai");
  const isai = await iSai.deploy();

  await isai.waitForDeployment();

  console.log("iSai contract deployed to:", isai.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
