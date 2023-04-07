// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.0;

contract ERC20Homework is ERC20, Ownable {
    using SafeMath for uint;

    uint public feeRatio;
    uint public burnRatio;
    address public feeAddress;

    constructor() ERC20("Test Token", "TTC") {}

    function mint(address _address, uint _amount) public onlyOwner {
        _mint(_address, _amount);
    }

    function setRatioAndAddress(uint _feeRatio, uint _burnRatio, address _feeAddress) public onlyOwner {
        feeRatio = _feeRatio;       // 转账费率
        burnRatio = _burnRatio;     // 销毁费率
        feeAddress = _feeAddress;   // 接收小费的地址
    }

    function burn(uint _amount) public onlyOwner {
        require(balanceOf(msg.sender) >= _amount, "burning token must not exceeds balance");
        _burn(msg.sender, _amount);
    }

    function transfer(address _to, uint _amount) public override returns (bool) {
        require(balanceOf(msg.sender) >= _amount, "insufficient fund");
        require(feeAddress != address(0), "feeAddress not set");
        require(feeRatio > 0, "feeRation not set");

        uint transferFee = _amount.mul(feeRatio).div(1000);
        uint burnAmount = _amount.mul(burnRatio).div(1000);
        uint transactionAmount = _amount.sub(transferFee).sub(burnAmount);

        _transfer(msg.sender, _to, transactionAmount);
        _transfer(msg.sender, feeAddress, transferFee);

        if (burnAmount > 0) {
            _burn(msg.sender, burnAmount);
        }

        return true;
    }

}