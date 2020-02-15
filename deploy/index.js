require('module-alias/register')

const utils = require("@utils/index.js");
const ethers = require("ethers")
const provider = utils.provider
let deployAccount = utils.ethersAccount(0)

const main = async () => {
    console.log("Deployment not configured yet!")
    await deployLocal()
}

const deployRinkeby = async () => {

}

const deployLocal = async () => {
    const dappFunder = await utils.deployContractAndWriteToFile('DappFunder', deployAccount, [])
    console.log("Con deployed at address: " + dappFunder.address)
}


main();