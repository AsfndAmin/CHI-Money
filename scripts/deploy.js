const { ethers } = require("hardhat");

async function main() {
 // Constructor arguments
 const floor = 9749;
 const ceiling = 9750;
 const params = {
   coreAddress: "0x3aFaFe6717F54108129eB9Dd83EA421BF08489F1",
   oracleAddress: "0x5a79D46b38bFe5044f3a30461008E6476F002C69",
   backupOracle: "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E",
   decimalsNormalizer: 0,
   doInvert: false,
 };
 const mintFeeBasisPoints = 0;
 const redeemFeeBasisPoints = 0;
 const reservesThreshold = ethers.BigNumber.from("20000000000000000000000000");
 const chiLimitPerSecond = ethers.BigNumber.from("10000000000000000000000");
 const mintingBufferCap = ethers.BigNumber.from("20000000000000000000000000");
 const underlyingTokenAddress = "0xD36580453CaD574C6F03F4DBd416a862e950eF59";
 const surplusTargetAddress = "0x69F569051566DAF21f5da2636E0C2636B0e39D49";

  const FixedPricePSM = await hre.ethers.getContractFactory("FixedPricePSM");
  const PSM = await FixedPricePSM.deploy(
    floor,
    ceiling,
    params,
    mintFeeBasisPoints,
    redeemFeeBasisPoints,
    reservesThreshold,
    chiLimitPerSecond,
    mintingBufferCap,
    underlyingTokenAddress,
    surplusTargetAddress
             );
  await PSM.deployed();
  console.log("PSM deployed to:", PSM.address);

  const WAIT_BLOCK_CONFIRMATIONS = 6;
  await PSM.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
  await run(`verify:verify`, {
    address: PSM.address,
    constructorArguments: [
      floor,
      ceiling,
      params,
      mintFeeBasisPoints,
      redeemFeeBasisPoints,
      reservesThreshold,
      chiLimitPerSecond,
      mintingBufferCap,
      underlyingTokenAddress,
      surplusTargetAddress
    ],
    
  });

  console.log("PSM contract verified");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
