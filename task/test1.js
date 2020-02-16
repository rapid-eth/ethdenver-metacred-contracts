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

    // console.log("SIG: " + sig)
    // let encodedMTX = dappFunderContract.encodeMetaTransction(metaproxyAddress, mtxData)
    // const con = dappFunderContract.connect(deployAccount)
    // let r = await con.getMTX(encodedMTX)
    // console.log(r)
    // let tx = await con.executeMetaTransaction(encodedMTX, dummysig, {gasLimit:5000000})

    let relayerConnection = dappFunderContract.connect(otherAccount)
    let abiMTX = await dappFunderContract.abiEncodeMetaTransction(metaproxyContract.address, mtx)
    let tx = await relayerConnection.executeMetaTransaction(abiMTX, sig, {gasLimit: 5000000})
    console.log(tx)
    let balanceAfter = await provider.getBalance(otherAccount.address)
    console.log("Balance: "+balanceAfter)
    console.log("Diff: "+balanceBefore.sub(balanceAfter))
    console.log("Diff Div: "+balanceBefore.sub(balanceAfter).div(tx.gasPrice))

    let metaDAOMembers = await miniDAOContract.totalMembers()
    console.log("Total Members: " + metaDAOMembers)

    let member = await miniDAOContract.members(endUserAccount.address)
    console.log("is Member: " + member)

    let g1 = await dappFunderContract.gas1()
    console.log("gas: " + g1)
    console.log("gas: " + g1.sub(5000000))


    let len1 = await dappFunderContract.len1()
    console.log("len: " + len1)

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
    let mtx = await metaMiniContract.submitProposal("hello CreatingCreatingCreatingCreatingCreatingCreatingCreatingCreatingCreatingCreatingCreatingCreatingCreatingCreatingCreatingCreatingCreatingCreatingCreating")

    return mtx
}

main()