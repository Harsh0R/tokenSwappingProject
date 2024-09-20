import {
  BalanceUpdated as BalanceUpdatedEvent,
  DepositTimeUpdated as DepositTimeUpdatedEvent,
  DurationUpdated as DurationUpdatedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PoolCreated as PoolCreatedEvent,
  ProfitWithdrawn as ProfitWithdrawnEvent,
  RewardRateUpdated as RewardRateUpdatedEvent,
  Staked as StakedEvent,
  TokenCreated as TokenCreatedEvent,
  UserData as UserDataEvent,
  Withdrawn as WithdrawnEvent
} from "../generated/Contract/Contract"
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
} from "../generated/schema"

export function handleBalanceUpdated(event: BalanceUpdatedEvent): void {
  let entity = new BalanceUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.poolId = event.params.poolId
  entity.newBalance = event.params.newBalance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDepositTimeUpdated(event: DepositTimeUpdatedEvent): void {
  let entity = new DepositTimeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.poolId = event.params.poolId
  entity.newDepositTime = event.params.newDepositTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDurationUpdated(event: DurationUpdatedEvent): void {
  let entity = new DurationUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.poolId = event.params.poolId
  entity.newDuration = event.params.newDuration

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePoolCreated(event: PoolCreatedEvent): void {
  let entity = new PoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.poolId = event.params.poolId
  entity.stakingToken = event.params.stakingToken
  entity.rewardToken = event.params.rewardToken
  entity.duration = event.params.duration
  entity.rewardRate = event.params.rewardRate
  entity.active = event.params.active

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProfitWithdrawn(event: ProfitWithdrawnEvent): void {
  let entity = new ProfitWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.profit = event.params.profit
  entity.poolId = event.params.poolId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRewardRateUpdated(event: RewardRateUpdatedEvent): void {
  let entity = new RewardRateUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.poolId = event.params.poolId
  entity.newRewardRate = event.params.newRewardRate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStaked(event: StakedEvent): void {
  let entity = new Staked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount
  entity.poolId = event.params.poolId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenCreated(event: TokenCreatedEvent): void {
  let entity = new TokenCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenAddress = event.params.tokenAddress
  entity.name = event.params.name
  entity.symbol = event.params.symbol
  entity.initialSupply = event.params.initialSupply

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserData(event: UserDataEvent): void {
  let entity = new UserData(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.poolId = event.params.poolId
  entity.referredBy = event.params.referredBy
  entity.withdrawnProfit = event.params.withdrawnProfit

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let entity = new Withdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.amount = event.params.amount
  entity.reward = event.params.reward
  entity.poolId = event.params.poolId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
