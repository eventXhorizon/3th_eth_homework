// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 对于业务量大的项目，可以把storage的内容提取出来，然后通过继承的方式组合
contract CrowdFundingStorage {
    struct Campaign {
        address payable receiver;       // 指定哪个地址可以有权接收合约里的资金
        uint numFunders;
        uint fundingGoal;
        uint totalAmount;
    }

    struct Funder {
        address addr;
        uint amount;
    }

    // 维护用户是否已经参与了某个项目的mapping
    mapping(uint => mapping(address => bool)) public isParticipate;
}

// 众筹合约
// 业务逻辑（用户参与、添加新的募集活动、活动结束后进行资金领取）
contract CrowdFunding is CrowdFundingStorage {
    // 只有合约的管理员才能发起众筹
    address immutable owner;

    constructor() {
        owner = msg.sender;
    }

    modifier isOwner() {
        require(owner == msg.sender);
        _;
    }

    // 防止用户重复参与
    modifier judgeParticipate(uint _campaignID) {
        require(isParticipate[_campaignID][msg.sender] == false);
        _;
    }

    // 可以组织多个众筹活动
    uint public numCampaigns;               // mapping获取不到长度，所以要维护一个值要记录长度
    mapping(uint => Campaign) campaigns;
    mapping(uint => Funder[]) funders;      // 每个活动可以有多人参与

    function newCampaign(address payable _receiver, uint _goal) external isOwner returns(uint campaignID) {
        campaignID = numCampaigns++;
        Campaign storage campaign = campaigns[campaignID];
        campaign.receiver = _receiver;
        campaign.fundingGoal = _goal;
    }

    // 用户参与
    function bid(uint _campaignID) external payable judgeParticipate(_campaignID) {
        Campaign storage campaign = campaigns[_campaignID];

        campaign.totalAmount += msg.value;
        campaign.numFunders += 1;

        funders[_campaignID].push(Funder({
        addr: msg.sender,
        amount: msg.value
        }));

        isParticipate[_campaignID][msg.sender] = true;
    }

    // 达到目标金额才可以取款
    function withdraw(uint _campaignID) external returns(bool reached) {
        Campaign storage campaign = campaigns[_campaignID];

        if (campaign.totalAmount < campaign.fundingGoal) {
            return false;
        }

        uint amount = campaign.totalAmount;
        campaign.totalAmount = 0;               // 防止被重复取走
        campaign.receiver.transfer(amount);

        return true;
    }
}