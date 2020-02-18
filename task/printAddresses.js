const {
    dappFunderContract,
    metaProxyContract,
    miniDAOContract,
} = require('./global')


const main = async () => {
    console.log()
    console.log("DappFunder: " + dappFunderContract.address)
    console.log("Metaproxy: " + metaProxyContract.address)
    console.log("DappFunder: " + miniDAOContract.address)
    console.log()
}

main()