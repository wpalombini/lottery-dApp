const LotteryContract = artifacts.require('LotteryContract');
const GovernanceContract = artifacts.require('GovernanceContract');
const RandomnessContract = artifacts.require('RandomnessContract');
const MockRandomnessContract = artifacts.require('MockRandomnessContract');

const LinkTokenInterface = artifacts.require('LinkTokenInterface');
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');

module.exports = async (deployer, network, accounts) => {
  LinkToken.setProvider(deployer.provider);
  try {
    await deployer.deploy(LinkToken, { from: accounts[0] });

    // Deploy Governance Contract and get an instance of it
    await deployer.deploy(GovernanceContract);
    const governanceContractDeployed = await GovernanceContract.deployed();

    // Deploy Lottery Contract passing the GovernanceContract address
    await deployer.deploy(LotteryContract, governanceContractDeployed.address);
    const lotteryContractDeployed = await LotteryContract.deployed();

    let randomnessContractDeployed;

    if (network === 'development') {
      // unit tests...
      // Deploy Mock Randomness Contract passing the LINK Token address and the GovernanceContract address
      await deployer.deploy(MockRandomnessContract, LinkToken.address, governanceContractDeployed.address);
      randomnessContractDeployed = await MockRandomnessContract.deployed();
      const token = await LinkTokenInterface.at(LinkToken.address);
      await token.transfer(randomnessContractDeployed.address, '1000000000000000000');
    } else {
      // testnet...
      // Deploy Randomness Contract passing the LINK Token address and the GovernanceContract address
      await deployer.deploy(RandomnessContract, LinkToken.address, governanceContractDeployed.address);
      randomnessContractDeployed = await RandomnessContract.deployed();
    }

    await governanceContractDeployed.init(lotteryContractDeployed.address, randomnessContractDeployed.address);
  } catch (err) {
    console.error(err);
  }
};
