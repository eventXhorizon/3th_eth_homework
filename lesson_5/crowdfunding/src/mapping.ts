import {BidLog, CampaignLog} from '../generated/CrowdFunding/CrowdFunding'
import {Bid, Campaign} from '../generated/schema'
import {Address, BigInt} from "@graphprotocol/graph-ts";

export function handleCampaignLog(event: CampaignLog): void {
  let campaign = Campaign.load(event.params.campaignID.toString());

  if (campaign == null) {
    campaign = new Campaign(event.params.campaignID.toString());
    campaign.receiver = event.params.receiver as Address;
    campaign.goal = event.params.goal as BigInt;
    campaign.save()
  }
}

export function handleBidLog(event: BidLog): void {
  let bid = Bid.load(event.params.campaignID.toString());

  if (bid == null) {
    bid = new Bid(event.params.campaignID.toString());
    bid.sender = event.params.sender as Address;
    bid.save();
  }
}
