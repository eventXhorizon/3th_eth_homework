const CustomERC20 = artifacts.require("CustomERC20");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(
        CustomERC20, accounts[0], "1000000000000000000000", "ABC Token", "ABC", 18, 0, 0, accounts[0]
    );
};
