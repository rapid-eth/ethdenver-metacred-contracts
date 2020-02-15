require('module-alias/register')

const utils = require('@utils');
const ethers = utils.ethers
const provider = utils.provider


const gasContract = utils.getDeployedContract('GasTest')


const deployAccount = utils.ethersAccount(0)
const otherAccount = utils.ethersAccount(1)
const altAccount = utils.ethersAccount(2)
const certAccount = utils.ethersAccount(3)


const main = async () => {
    console.log("Running Main Task...")

    let tx1 = await deployAccount.sendTransaction({to: gasContract.address, value: ethers.utils.parseEther("1")})

    let contractBalance = await provider.getBalance(gasContract.address)
    console.log("ConBalance: "+contractBalance)

    let balanceBefore = await provider.getBalance(deployAccount.address)
    console.log("Balance: "+balanceBefore)

    const con = gasContract.connect(deployAccount)

    let tx = await con.refundGasSetString("hello", {gasLimit:5000000})

    let balanceAfter = await provider.getBalance(deployAccount.address)
    console.log("Balance: "+balanceAfter)

    console.log("Diff: "+balanceBefore.sub(balanceAfter))


}

main()