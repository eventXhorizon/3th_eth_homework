const { expect } = require("chai");
const {ethers} = require("hardhat");

describe("ERC20Homework", function () {
    // mint测试用例
    it("mint", async() => {
        const ERC20Contract = await ethers.getContractFactory("ERC20Homework");
        const erc20Contract = await ERC20Contract.deploy();
        const contractInstance = await erc20Contract.deployed();

        const [account] = await ethers.getSigners();
        let amount = 1000000000;
        await contractInstance.mint(account.address, amount);

        const account_balance = await contractInstance.balanceOf(account.address);
        expect(account_balance.toNumber()).equal(amount);
    })

    // transfer测试用例
    it("transfer", async() => {
        const ERC20Contract = await ethers.getContractFactory("ERC20Homework");
        const erc20Contract = await ERC20Contract.deploy();
        const contractInstance = await erc20Contract.deployed();

        const [sender, receiver] = await ethers.getSigners();
        let amount = 1000000000;
        await contractInstance.mint(sender.address, amount);

        let feeRatio = 10;
        let burnRatio = 10;
        let feeAddress = sender.address;
        await contractInstance.setRatioAndAddress(feeRatio, burnRatio, feeAddress);


        let transferAmount = 1000000000;
        await contractInstance.transfer(receiver.address, transferAmount);
        const receiver_balance_after_transfer = await contractInstance.balanceOf(receiver.address);
        const feeAmount = transferAmount * feeRatio / 1000;
        const burnAmount = transferAmount * burnRatio / 1000;
        transferAmount = transferAmount - feeAmount - burnAmount;

        expect(receiver_balance_after_transfer.toNumber()).equal(transferAmount);

    })

    // burn测试用例
    it("burn", async() => {
        const ERC20Contract = await ethers.getContractFactory("ERC20Homework");
        const erc20Contract = await ERC20Contract.deploy();
        const contractInstance = await erc20Contract.deployed();

        const [sender] = await ethers.getSigners();
        let amount = 1000000000;
        await contractInstance.mint(sender.address, amount);

        let feeRatio = 10;
        let burnRatio = 10;
        let feeAddress = sender.address;
        await contractInstance.setRatioAndAddress(feeRatio, burnRatio, feeAddress);

        let burnAmount = 1000000000;
        await contractInstance.burn(burnAmount);
        const account_balance_after_burn = await contractInstance.balanceOf(sender.address);
        expect(account_balance_after_burn.toNumber()).equal( 0);

    })
})