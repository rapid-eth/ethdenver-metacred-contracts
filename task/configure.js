require('module-alias/register')

const utils = require('@utils');
const ethers = utils.ethers
const provider = utils.provider


const dappFunderContract = utils.getDeployedContract('DappFunder')
const metaproxyContract = utils.getDeployedContract('MetaProxy')
const miniDAOContract = utils.getDeployedContract('MetaMiniDAO')


const deployAccount = utils.ethersAccount(0)
const otherAccount = utils.ethersAccount(1)
const altAccount = utils.ethersAccount(2)
const certAccount = utils.ethersAccount(3)

let DDA_PK = ethers.utils.id("dapp dev")
let EU_PK = ethers.utils.id("end user")

let dappDevAccount = new ethers.Wallet(DDA_PK, provider)
let endUserAccount = new ethers.Wallet(EU_PK, provider)

const main = async () => {
    console.log("Running Configure...")

    let ownerMiniDAO = miniDAOContract.connect(deployAccount)
    
    let o = await miniDAOContract.owner()
    console.log(o)
    // transfer ownership to a key with a 0 balance (DDA)
    await ownerMiniDAO.transferOwnership(dappDevAccount.address)

    let mdowner = await miniDAOContract.owner()
    console.log("Owner of MINI DAO: " + mdowner)


    let funderContract = dappFunderContract.connect(deployAccount)
    //supply it with eth
    let tx1 = await deployAccount.sendTransaction({to: dappFunderContract.address, value: ethers.utils.parseEther(".5")})

    //add DDA as delegate
    let tx2 = await funderContract.toggleDelegate(dappDevAccount.address, true)

    //configure metaproxy address and function signature
    let tx3 = await funderContract.addMetaContract(metaproxyContract.address, "proxy(bytes)")

}

main()