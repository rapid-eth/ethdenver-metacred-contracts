require('module-alias/register')

const utils = require('@utils');
const ethers = utils.ethers
const provider = utils.provider


const dappFunderContract = utils.getDeployedContract('DappFunder')
const relayer = utils.ethersAccount(5)

let signature = ""
let rawTX = ""
const main = async () => {
    console.log("Running Main Task...")


    let tx = await relayer.sendTransaction({to: relayer.address, value:1222})
    console.log(tx)

}


main()