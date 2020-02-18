require('module-alias/register')

const utils = require('@utils');
const ethers = utils.ethers
const provider = utils.provider


const dappFunderContract = utils.getDeployedContract('DappFunder')
const metaProxyContract = utils.getDeployedContract('MetaProxy')
const miniDAOContract = utils.getDeployedContract('MetaMiniDAO')


const deployAccount = utils.ethersAccount(0)
const otherAccount = utils.ethersAccount(1)
const altAccount = utils.ethersAccount(2)

let DDA_PK = ethers.utils.id("dapp dev")
let EU_PK = ethers.utils.id("end user")
let dappDevAccount = new ethers.Wallet(DDA_PK, provider)
let endUserAccount = new ethers.Wallet(EU_PK, provider)

module.exports = {
    utils,
    ethers,
    provider,
    dappFunderContract,
    metaProxyContract,
    miniDAOContract,
    deployAccount,
    otherAccount,
    altAccount,
    dappDevAccount,
    endUserAccount
}