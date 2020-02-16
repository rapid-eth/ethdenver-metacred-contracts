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


let metaproxyAddress = "0x345cd2737aDAAe888e4c6F3EDd108C1b7BbEbAB4"
let mtxProxyFunctionSig = "0x10498e9c"
let mtxData = "0x0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000134c4ddf2b493177351971743f09cee9496de7c000000000000000000000000000000000000000000000000000000002540be3ff00000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000001bfc807ea5031e0e5730c182b4491e221b28e53579211ccefe60c721afbf3b6fc649b906ac807c1b3a74e4531f3409480ad02cf544e4b7f9df34a53d952dbae98e00000000000000000000000000000000000000000000000000000000000000a49900584d00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002548656c6c6f2c204d6574615478206173646173646173647361646173646120576f726c642100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
let dummysig = "0xf9ccfc7934069936ff098aac7a80eae2d478aba86cc77ed430e86b51249f6aa60492843bb965e9b217cccfbd2a83897a829ee7a85044f6703626ec5494c6aba11b"
const main = async () => {
    console.log("Running Configure...")


    let ownerMiniDAO = miniDAOContract.connect(deployAccount)
    
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