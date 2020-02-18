
const {
    ethers,
    provider,
    dappFunderContract,
    metaProxyContract,
    miniDAOContract,
    deployAccount,
    otherAccount,
    dappDevAccount,
    endUserAccount
} = require('./global')

const main = async () => {

    console.log("Running Main Task...")

    let contractBalance = await provider.getBalance(dappFunderContract.address)
    console.log("ConBalance: "+contractBalance)

    let balanceBefore = await provider.getBalance(otherAccount.address)
    console.log("Balance: "+balanceBefore)

    let mtx = await createMetaTx()
    // let mtx = await createLongerMetaTx()
    // console.log(mtx)

    let dataToSign = await dappFunderContract.encodeMetaTransction(metaProxyContract.address, mtx)

    let abicoder = ethers.utils.defaultAbiCoder

    let dts = abicoder.encode(["address","bytes"],[metaProxyContract.address, mtx])
    console.log()
    console.log(dts)
    let sig = await dappDevAccount.signMessage(ethers.utils.arrayify(dataToSign))

    let relayerConnection = dappFunderContract.connect(otherAccount)
    let abiMTX = await dappFunderContract.abiEncodeMetaTransction(metaProxyContract.address, mtx)
    console.log(abiMTX)

    process.exit()

    let tx = await relayerConnection.executeMetaTransaction(abiMTX, sig, {gasLimit: 5000000})

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