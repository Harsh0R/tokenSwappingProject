import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { BalanceUpdated } from "../generated/schema"
import { BalanceUpdated as BalanceUpdatedEvent } from "../generated/Contract/Contract"
import { handleBalanceUpdated } from "../src/contract"
import { createBalanceUpdatedEvent } from "./contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let user = Address.fromString("0x0000000000000000000000000000000000000001")
    let poolId = BigInt.fromI32(234)
    let newBalance = BigInt.fromI32(234)
    let newBalanceUpdatedEvent = createBalanceUpdatedEvent(
      user,
      poolId,
      newBalance
    )
    handleBalanceUpdated(newBalanceUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BalanceUpdated created and stored", () => {
    assert.entityCount("BalanceUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BalanceUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "user",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "BalanceUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "poolId",
      "234"
    )
    assert.fieldEquals(
      "BalanceUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newBalance",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
