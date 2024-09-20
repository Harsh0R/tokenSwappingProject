import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  BalanceUpdated,
  DepositTimeUpdated,
  DurationUpdated,
  OwnershipTransferred,
  PoolCreated,
  ProfitWithdrawn,
  RewardRateUpdated,
  Staked,
  TokenCreated,
  UserData,
  Withdrawn
} from "../generated/Contract/Contract"

export function createBalanceUpdatedEvent(
  user: Address,
  poolId: BigInt,
  newBalance: BigInt
): BalanceUpdated {
  let balanceUpdatedEvent = changetype<BalanceUpdated>(newMockEvent())

  balanceUpdatedEvent.parameters = new Array()

  balanceUpdatedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  balanceUpdatedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  balanceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newBalance",
      ethereum.Value.fromUnsignedBigInt(newBalance)
    )
  )

  return balanceUpdatedEvent
}

export function createDepositTimeUpdatedEvent(
  user: Address,
  poolId: BigInt,
  newDepositTime: BigInt
): DepositTimeUpdated {
  let depositTimeUpdatedEvent = changetype<DepositTimeUpdated>(newMockEvent())

  depositTimeUpdatedEvent.parameters = new Array()

  depositTimeUpdatedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  depositTimeUpdatedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  depositTimeUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newDepositTime",
      ethereum.Value.fromUnsignedBigInt(newDepositTime)
    )
  )

  return depositTimeUpdatedEvent
}

export function createDurationUpdatedEvent(
  poolId: BigInt,
  newDuration: BigInt
): DurationUpdated {
  let durationUpdatedEvent = changetype<DurationUpdated>(newMockEvent())

  durationUpdatedEvent.parameters = new Array()

  durationUpdatedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  durationUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newDuration",
      ethereum.Value.fromUnsignedBigInt(newDuration)
    )
  )

  return durationUpdatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPoolCreatedEvent(
  poolId: BigInt,
  stakingToken: Address,
  rewardToken: Address,
  duration: BigInt,
  rewardRate: BigInt,
  active: boolean
): PoolCreated {
  let poolCreatedEvent = changetype<PoolCreated>(newMockEvent())

  poolCreatedEvent.parameters = new Array()

  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "stakingToken",
      ethereum.Value.fromAddress(stakingToken)
    )
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "rewardToken",
      ethereum.Value.fromAddress(rewardToken)
    )
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "duration",
      ethereum.Value.fromUnsignedBigInt(duration)
    )
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "rewardRate",
      ethereum.Value.fromUnsignedBigInt(rewardRate)
    )
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("active", ethereum.Value.fromBoolean(active))
  )

  return poolCreatedEvent
}

export function createProfitWithdrawnEvent(
  user: Address,
  profit: BigInt,
  poolId: BigInt
): ProfitWithdrawn {
  let profitWithdrawnEvent = changetype<ProfitWithdrawn>(newMockEvent())

  profitWithdrawnEvent.parameters = new Array()

  profitWithdrawnEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  profitWithdrawnEvent.parameters.push(
    new ethereum.EventParam("profit", ethereum.Value.fromUnsignedBigInt(profit))
  )
  profitWithdrawnEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )

  return profitWithdrawnEvent
}

export function createRewardRateUpdatedEvent(
  poolId: BigInt,
  newRewardRate: BigInt
): RewardRateUpdated {
  let rewardRateUpdatedEvent = changetype<RewardRateUpdated>(newMockEvent())

  rewardRateUpdatedEvent.parameters = new Array()

  rewardRateUpdatedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  rewardRateUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newRewardRate",
      ethereum.Value.fromUnsignedBigInt(newRewardRate)
    )
  )

  return rewardRateUpdatedEvent
}

export function createStakedEvent(
  user: Address,
  amount: BigInt,
  poolId: BigInt
): Staked {
  let stakedEvent = changetype<Staked>(newMockEvent())

  stakedEvent.parameters = new Array()

  stakedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )

  return stakedEvent
}

export function createTokenCreatedEvent(
  tokenAddress: Address,
  name: string,
  symbol: string,
  initialSupply: BigInt
): TokenCreated {
  let tokenCreatedEvent = changetype<TokenCreated>(newMockEvent())

  tokenCreatedEvent.parameters = new Array()

  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam("symbol", ethereum.Value.fromString(symbol))
  )
  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "initialSupply",
      ethereum.Value.fromUnsignedBigInt(initialSupply)
    )
  )

  return tokenCreatedEvent
}

export function createUserDataEvent(
  user: Address,
  poolId: BigInt,
  referredBy: Address,
  withdrawnProfit: BigInt
): UserData {
  let userDataEvent = changetype<UserData>(newMockEvent())

  userDataEvent.parameters = new Array()

  userDataEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  userDataEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )
  userDataEvent.parameters.push(
    new ethereum.EventParam(
      "referredBy",
      ethereum.Value.fromAddress(referredBy)
    )
  )
  userDataEvent.parameters.push(
    new ethereum.EventParam(
      "withdrawnProfit",
      ethereum.Value.fromUnsignedBigInt(withdrawnProfit)
    )
  )

  return userDataEvent
}

export function createWithdrawnEvent(
  user: Address,
  amount: BigInt,
  reward: BigInt,
  poolId: BigInt
): Withdrawn {
  let withdrawnEvent = changetype<Withdrawn>(newMockEvent())

  withdrawnEvent.parameters = new Array()

  withdrawnEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("reward", ethereum.Value.fromUnsignedBigInt(reward))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromUnsignedBigInt(poolId))
  )

  return withdrawnEvent
}
