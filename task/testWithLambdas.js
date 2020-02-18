
const axios = require('axios');

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

    console.log(dappDevAccount)

    let memberBefore = await miniDAOContract.members(endUserAccount.address)
    console.log("is MemberBefore: " + memberBefore)

    let contractBalance = await provider.getBalance(dappFunderContract.address)
    console.log("ConBalance: "+contractBalance)

    let balanceBefore = await provider.getBalance(otherAccount.address)
    console.log("Balance: "+balanceBefore)

    let mtx = await createMetaTx()
    console.log(mtx)

    // Send mtx to DappSigner Lambda
    let lambadurl = "https://m2r4h61qui.execute-api.us-east-1.amazonaws.com/prod/ethdenver-dapp-signer"
    let res = await sendLambdaRequest(lambadurl, {metaTx: mtx} )
    console.log(res.data)

    // let dataToSign = await dappFunderContract.encodeMetaTransction(metaproxyContract.address, mtx)
    // console.log("dataToSign",dataToSign)
    let abiMTX = await dappFunderContract.abiEncodeMetaTransction(metaproxyContract.address, mtx)
    console.log("abiMTX",abiMTX)

    // let sig2 = await dappDevAccount.signMessage(ethers.utils.arrayify(dataToSign))
    // console.log("SIG: " + sig2)
    console.log("dappDevAccount.address: " +  dappDevAccount.address)
    // // Submit mtx + signature to Relayer Lambda
    let sig = res.data.signature
    let relayerConnection = dappFunderContract.connect(otherAccount)
    await relayerConnection.executeMetaTransaction(abiMTX, sig, {gasLimit: 5000000})

    let balanceAfter = await provider.getBalance(otherAccount.address)
    console.log("Balance: "+balanceAfter)
    console.log("Diff: "+balanceBefore.sub(balanceAfter))

    let metaDAOMembers = await miniDAOContract.totalMembers()
    console.log("Total Members: " + metaDAOMembers)

    let member = await miniDAOContract.members(endUserAccount.address)
    console.log("is Member: " + member)
}

const sendLambdaRequest = async (url, postData) => {
    let data = await axios.post(url, postData)
    // console.log("POST Data",data)
    return data
}

const createMetaTx = async () => {
    console.log("Creating meta transaction...")

    let metaMiniContract = miniDAOContract.connectMeta(endUserAccount.toMetaWallet())
    let mtx = await metaMiniContract.join()

    return mtx
}

main()