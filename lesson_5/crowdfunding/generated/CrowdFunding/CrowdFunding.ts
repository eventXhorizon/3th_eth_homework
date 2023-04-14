// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class BidLog extends ethereum.Event {
  get params(): BidLog__Params {
    return new BidLog__Params(this);
  }
}

export class BidLog__Params {
  _event: BidLog;

  constructor(event: BidLog) {
    this._event = event;
  }

  get campaignID(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get sender(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class CampaignLog extends ethereum.Event {
  get params(): CampaignLog__Params {
    return new CampaignLog__Params(this);
  }
}

export class CampaignLog__Params {
  _event: CampaignLog;

  constructor(event: CampaignLog) {
    this._event = event;
  }

  get campaignID(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get receiver(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get goal(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class CrowdFunding__campaignArrayResult {
  value0: Address;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;

  constructor(value0: Address, value1: BigInt, value2: BigInt, value3: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    return map;
  }

  getReceiver(): Address {
    return this.value0;
  }

  getNumFunders(): BigInt {
    return this.value1;
  }

  getFundingGoal(): BigInt {
    return this.value2;
  }

  getTotalAmount(): BigInt {
    return this.value3;
  }
}

export class CrowdFunding extends ethereum.SmartContract {
  static bind(address: Address): CrowdFunding {
    return new CrowdFunding("CrowdFunding", address);
  }

  newCampaign(_receiver: Address, _goal: BigInt): BigInt {
    let result = super.call(
      "newCampaign",
      "newCampaign(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_receiver),
        ethereum.Value.fromUnsignedBigInt(_goal)
      ]
    );

    return result[0].toBigInt();
  }

  try_newCampaign(
    _receiver: Address,
    _goal: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "newCampaign",
      "newCampaign(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_receiver),
        ethereum.Value.fromUnsignedBigInt(_goal)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  withdraw(_campaignID: BigInt): boolean {
    let result = super.call("withdraw", "withdraw(uint256):(bool)", [
      ethereum.Value.fromUnsignedBigInt(_campaignID)
    ]);

    return result[0].toBoolean();
  }

  try_withdraw(_campaignID: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall("withdraw", "withdraw(uint256):(bool)", [
      ethereum.Value.fromUnsignedBigInt(_campaignID)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  campaignArray(param0: BigInt): CrowdFunding__campaignArrayResult {
    let result = super.call(
      "campaignArray",
      "campaignArray(uint256):(address,uint256,uint256,uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new CrowdFunding__campaignArrayResult(
      result[0].toAddress(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt()
    );
  }

  try_campaignArray(
    param0: BigInt
  ): ethereum.CallResult<CrowdFunding__campaignArrayResult> {
    let result = super.tryCall(
      "campaignArray",
      "campaignArray(uint256):(address,uint256,uint256,uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new CrowdFunding__campaignArrayResult(
        value[0].toAddress(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt()
      )
    );
  }

  isParticipate(param0: BigInt, param1: Address): boolean {
    let result = super.call(
      "isParticipate",
      "isParticipate(uint256,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromAddress(param1)
      ]
    );

    return result[0].toBoolean();
  }

  try_isParticipate(
    param0: BigInt,
    param1: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isParticipate",
      "isParticipate(uint256,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromAddress(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  numCampaigns(): BigInt {
    let result = super.call("numCampaigns", "numCampaigns():(uint256)", []);

    return result[0].toBigInt();
  }

  try_numCampaigns(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("numCampaigns", "numCampaigns():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class BidCall extends ethereum.Call {
  get inputs(): BidCall__Inputs {
    return new BidCall__Inputs(this);
  }

  get outputs(): BidCall__Outputs {
    return new BidCall__Outputs(this);
  }
}

export class BidCall__Inputs {
  _call: BidCall;

  constructor(call: BidCall) {
    this._call = call;
  }

  get _campaignID(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class BidCall__Outputs {
  _call: BidCall;

  constructor(call: BidCall) {
    this._call = call;
  }
}

export class NewCampaignCall extends ethereum.Call {
  get inputs(): NewCampaignCall__Inputs {
    return new NewCampaignCall__Inputs(this);
  }

  get outputs(): NewCampaignCall__Outputs {
    return new NewCampaignCall__Outputs(this);
  }
}

export class NewCampaignCall__Inputs {
  _call: NewCampaignCall;

  constructor(call: NewCampaignCall) {
    this._call = call;
  }

  get _receiver(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _goal(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class NewCampaignCall__Outputs {
  _call: NewCampaignCall;

  constructor(call: NewCampaignCall) {
    this._call = call;
  }

  get campaignID(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class WithdrawCall extends ethereum.Call {
  get inputs(): WithdrawCall__Inputs {
    return new WithdrawCall__Inputs(this);
  }

  get outputs(): WithdrawCall__Outputs {
    return new WithdrawCall__Outputs(this);
  }
}

export class WithdrawCall__Inputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }

  get _campaignID(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class WithdrawCall__Outputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }

  get reached(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}