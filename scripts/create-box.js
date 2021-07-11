const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Carton = await hre.ethers.getContractFactory("Carton");
  const carton = await Carton.attach(
    "0x8b401BEe910bd2B810715Ca459434A884C266324"
  );

  const LAT = hre.ethers.utils.formatBytes32String(40.7149374334028);
  const LNG = hre.ethers.utils.formatBytes32String(-73.96084815851665);

  await carton.createBox(LAT, LNG);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
