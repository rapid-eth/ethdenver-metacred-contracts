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
    console.log("Running Main Task...")

    let contractBalance = await provider.getBalance(dappFunderContract.address)
    console.log("ConBalance: "+contractBalance)

    let balanceBefore = await provider.getBalance(otherAccount.address)
    console.log("Balance: "+balanceBefore)

    let mtx = await createMetaTx()
    // let mtx = await createLongerMetaTx()
    // console.log(mtx)

    let dataToSign = await dappFunderContract.encodeMetaTransction(metaproxyContract.address, mtx)
    let sig = await dappDevAccount.signMessage(ethers.utils.arrayify(dataToSign))



    let relayerConnection = dappFunderContract.connect(otherAccount)
    let abiMTX = await dappFunderContract.abiEncodeMetaTransction(metaproxyContract.address, mtx)
    let tx = await relayerConnection.executeMetaTransaction(abiMTX, sig, {gasLimit: 5000000})
    console.log(tx)
    let balanceAfter = await provider.getBalance(otherAccount.address)
    console.log("Balance: "+balanceAfter)
    let diff = balanceBefore.sub(balanceAfter);
    console.log("Diff: "+diff)
    console.log("Diff Div: "+balanceBefore.sub(balanceAfter).div(tx.gasPrice))

    let metaDAOMembers = await miniDAOContract.totalMembers()
    console.log("Total Members: " + metaDAOMembers)

    let member = await miniDAOContract.members(endUserAccount.address)
    console.log("is Member: " + member)

}

const createMetaTx = async () => {
    console.log("Creating meta transaction...")

    let metaMiniContract = miniDAOContract.connectMeta(endUserAccount.toMetaWallet())
    let mtx = await metaMiniContract.join()

    return mtx
}

const createLongerMetaTx = async () => {
    console.log("Creating meta transaction...")

    let metaMiniContract = miniDAOContract.connectMeta(endUserAccount.toMetaWallet())
    let mtx = await metaMiniContract.submitProposal("hello")

    return mtx
}

main()