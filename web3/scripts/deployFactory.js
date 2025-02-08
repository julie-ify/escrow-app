const { ethers } = require("hardhat");

async function main() {
  const EscrowFactory = await ethers.getContractFactory("EscrowFactory");
  const factory = await EscrowFactory.deploy();
  await factory.deployed();

  console.log("EscrowFactory deployed at:", factory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

