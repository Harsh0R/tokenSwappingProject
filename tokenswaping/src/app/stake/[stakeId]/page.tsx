"use client";

import { ContractContext } from "@/Context/contractContect";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BigNumberish } from "ethers";

const StakeIdPage = () => {
  const params = useParams();
  const stakeId = params.stakeId;
  const [stakeAmount, setStakeAmount] = useState<number | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [poolData, setPoolData] = useState<any>(null);
  const [stakeTokenData, setStakeTokenData] = useState<any>(null);
  const [rewardTokenData, setRewardTokenData] = useState<any>(null);
  const [stakeBtnStatus, setStakeBtnStatus] = useState(false);
  const [calculatedReward, setCalculatedReward] = useState<number | null>(null);

  const {
    account,
    getPoolData,
    getTokenData,
    stakeFunc,
    withdrawAllAmountFunc,
    withdrawProfitFunc,
    withdrawSpecificProfitFunc,
    showMyBalancesInPoolFunc,
    calculateRewardFunc,
    hasValideAllowanceForStakingToken,
    increaseAllowanceForStakingToken,
  } = useContext(ContractContext);

  const handleApproveToken = async (address: string, decimal: number) => {
    if (!address || !stakeAmount || !decimal) {
      alert("Please fill all the required fields");
      return;
    }
    console.log("Address =>", address);

    const tx = await increaseAllowanceForStakingToken(
      address,
      stakeAmount,
      decimal
    );
  };

  const fetchPoolData = async () => {
    try {
      const poolindex = parseInt(stakeId.toString());
      const data = await getPoolData(stakeId);
      const stakeTokenData = await getTokenData(data.stakingToken);
      const rewardTokenData = await getTokenData(data.rewardToken);
      await handleShowMyBalancesInPool(poolindex, stakeTokenData.decimal);

      setStakeTokenData(stakeTokenData);
      setRewardTokenData(rewardTokenData);

      setPoolData({
        ...data,
        stakeToken: stakeTokenData.name,
        rewardToken: rewardTokenData.name,
      });
      setStakeBtnStatus(true);
    } catch (error) {
      console.error("Error fetching pool data:", error);
    }
  };

  const handleStake = async (poolId: number, decimal: number) => {
    setErrorMessage("");
    try {
      const Validamount = await hasValideAllowanceForStakingToken(
        stakeTokenData.address,
        decimal
      );
      if (Validamount < stakeAmount) {
        alert("Insufficient allowance");
        return;
      }

      await stakeFunc(stakeAmount, poolId, decimal);
      setSuccessMessage("Successfully staked!");
    } catch (error) {
      setErrorMessage("Error in staking");
    }
  };

  const handleWithdrawAllAmount = async (poolId: number) => {
    setErrorMessage("");
    try {
      await withdrawAllAmountFunc(poolId);
      setSuccessMessage("Successfully withdrew all staked amount!");
    } catch (error) {
      setErrorMessage("Error in withdrawing all amount");
    }
  };

  const handleWithdrawProfit = async (poolId: number) => {
    setErrorMessage("");
    try {
      await withdrawProfitFunc(poolId);
      setSuccessMessage("Successfully withdrew profit!");
    } catch (error) {
      setErrorMessage("Error in withdrawing profit");
    }
  };

  const handleWithdrawSpecificProfit = async (poolId: number) => {
    setErrorMessage("");
    try {
      await withdrawSpecificProfitFunc(withdrawAmount, poolId);
      setSuccessMessage("Successfully withdrew specific profit!");
    } catch (error) {
      setErrorMessage("Error in withdrawing specific profit");
    }
  };

  const handleShowMyBalancesInPool = async (
    poolId: number,
    decimal: number
  ) => {
    setErrorMessage("");
    try {
      const result = await showMyBalancesInPoolFunc(poolId, decimal);
      console.log("My balances:", result);
      setStakeAmount(result);
    } catch (error) {
      console.log("Error in showing my balances in pool =>", error);
      setErrorMessage("Error in showing my balances in pool");
    }
  };

  const handleCalculateReward = async (poolId: number, decimal: number) => {
    setErrorMessage("");
    try {
      const result = await calculateRewardFunc(poolId, decimal);
      console.log("Calculated reward:", result);
      setCalculatedReward(result);
    } catch (error) {
      setErrorMessage("Error in calculating reward");
    }
  };

  // Set up an interval to calculate the reward every second
  useEffect(() => {
    if (stakeBtnStatus) {
      const intervalId = setInterval(() => {
        handleCalculateReward(Number(stakeId), rewardTokenData.decimal);
      }, 1000); // Every 1 second

      // Cleanup the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [stakeBtnStatus]);

  useEffect(() => {
    fetchPoolData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Stake Pool ID: {stakeId}</h2>

      {/* Display pool data */}
      {poolData && (
        <Card className="w-full flex">
          <CardContent>
            <CardHeader>
              <h3 className="text-xl font-semibold">Pool Information</h3>
            </CardHeader>
            <p>
              <strong>Staking Token:</strong> {poolData.stakeToken}
            </p>
            <p>
              <strong>Reward Token:</strong> {poolData.rewardToken}
            </p>
            <p>
              <strong>Duration:</strong> {poolData.duration.toString()} seconds
            </p>
            <p>
              <strong>Reward Rate:</strong> {poolData.rewardRate.toString()}
            </p>
            <p>
              <strong>Minimum Stake Amount:</strong>{" "}
              {poolData.minStakeAmount.toString()}
            </p>
          </CardContent>
          <CardContent>
            <CardHeader>
              <h3 className="text-xl font-semibold">Pool Balance</h3>
            </CardHeader>
            <p>
              <strong>Staking Token Blanace:</strong>{" "}
              {stakeTokenData.balanceOfContract}
            </p>
            <p>
              <strong>Reward Token Balance:</strong>{" "}
              {rewardTokenData.balanceOfContract}
            </p>
          </CardContent>
          <CardContent>
            <CardHeader>
              <h3 className="text-xl font-semibold">Your Wallet Balance</h3>
            </CardHeader>
            <p>
              <strong>Staking Token Balance:</strong>{" "}
              {stakeTokenData.balanceOfAccount}
            </p>
            <p>
              <strong>Reward Token Balance:</strong>{" "}
              {rewardTokenData.balanceOfAccount}
            </p>
          </CardContent>
          <CardContent>
            <CardHeader>
              <h3 className="text-xl font-semibold">
                Your Stake Balance in this Pool: {stakeAmount}
              </h3>
            </CardHeader>
          </CardContent>
        </Card>
      )}

      {/* Real-Time Reward Display */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold">
          Your Current Reward:
          {calculatedReward !== null && !isNaN(Number(calculatedReward))
            ? Number(calculatedReward).toFixed(6)
            : "Loading..."}
        </h3>
      </div>

      {/* Stake Form */}
      <div className="space-y-4 mt-6">
        <Input
          type="number"
          placeholder="Enter stake amount"
          value={stakeAmount || ""}
          onChange={(e) => setStakeAmount(Number(e.target.value))}
        />
        <Button
          variant={"outline"}
          className="m-2"
          onClick={() =>
            handleApproveToken(stakeTokenData.address, stakeTokenData.decimal)
          }
          disabled={!stakeBtnStatus}
        >
          Approve Token
        </Button>
        <Button
          className="m-2"
          onClick={() => handleStake(Number(stakeId), stakeTokenData.decimal)}
          disabled={!stakeBtnStatus}
        >
          Stake
        </Button>

        <Input
          type="number"
          placeholder="Enter amount to withdraw profit"
          value={withdrawAmount || ""}
          onChange={(e) => setWithdrawAmount(Number(e.target.value))}
        />
        <Button
          onClick={() => handleWithdrawSpecificProfit(Number(stakeId))}
          disabled={!stakeBtnStatus}
        >
          Withdraw Specific Profit
        </Button>

        <br />
        <Button
          onClick={() => handleWithdrawAllAmount(Number(stakeId))}
          disabled={!stakeBtnStatus}
        >
          Withdraw All Staked Amount
        </Button>
        <br />
        <Button
          onClick={() => handleWithdrawProfit(Number(stakeId))}
          disabled={!stakeBtnStatus}
        >
          Withdraw Profit
        </Button>

        {/* <Button
          onClick={() => handleCalculateReward(Number(stakeId))}
          disabled={!stakeBtnStatus}
        >
          Calculate Reward
        </Button> */}
      </div>

      {/* Error message */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Success message */}
      {successMessage && (
        <Alert variant="default">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default StakeIdPage;
