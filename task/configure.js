const {
    ethers,
    dappFunderContract,
    metaProxyContract,
    miniDAOContract,
    deployAccount,
    dappDevAccount,
} = require('./global')

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
    let tx3 = await funderContract.addMetaContract(metaProxyContract.address, "proxy(bytes)")

}

main()