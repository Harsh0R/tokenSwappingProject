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
  const [referralAddress, setReferralAddress] = useState<string>("");

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
    addReferralFunc,
  } = useContext(ContractContext);

  // Unified error handler
  const handleError = (error: any, message: string) => {
    console.error(message, error);
    setErrorMessage(message);
  };

  const handleApproveToken = async (address: string, decimal: number) => {
    if (!address || !stakeAmount || !decimal) {
      alert("Please fill all the required fields");
      return;
    }

    try {
      await increaseAllowanceForStakingToken(address, stakeAmount, decimal);
      setSuccessMessage("Token approved successfully!");
    } catch (error) {
      handleError(error, "Error in approving token");
    }
  };

  const fetchPoolData = async () => {
    try {
      const poolindex = parseInt(stakeId.toString());
      const data = await getPoolData(stakeId);
      const stakeTokenData = await getTokenData(data.stakingToken);
      const rewardTokenData = await getTokenData(data.rewardToken);

      setStakeTokenData(stakeTokenData);
      setRewardTokenData(rewardTokenData);

      await handleShowMyBalancesInPool(poolindex, stakeTokenData.decimal);
      setPoolData({
        ...data,
        stakeToken: stakeTokenData.name,
        rewardToken: rewardTokenData.name,
      });
      setStakeBtnStatus(true);
    } catch (error) {
      handleError(error, "Error fetching pool data");
    }
  };

  const handleStake = async (poolId: number, decimal: number) => {
    setErrorMessage("");
    try {
      const validAmount = await hasValideAllowanceForStakingToken(
        stakeTokenData.address,
        decimal
      );
      if (stakeAmount && validAmount < stakeAmount) {
        alert("Insufficient allowance");
        return;
      }

      const data = await getPoolData(stakeId);
      const rewardTokenData = await getTokenData(data.rewardToken);
      setStakeTokenData(stakeTokenData);
      setRewardTokenData(rewardTokenData);
      await stakeFunc(stakeAmount, poolId, decimal);
      setSuccessMessage("Successfully staked!");
    } catch (error) {
      handleError(error, "Error in staking");
    }
  };

  const handleWithdrawAllAmount = async (poolId: number) => {
    try {
      await withdrawAllAmountFunc(poolId);
      const data = await getPoolData(stakeId);
      const stakeTokenData = await getTokenData(data.stakingToken);
      const rewardTokenData = await getTokenData(data.rewardToken);
      setStakeTokenData(stakeTokenData);
      setRewardTokenData(rewardTokenData);
      setSuccessMessage("Successfully withdrew all staked amount!");
    } catch (error) {
      handleError(error, "Error in withdrawing all amount");
    }
  };

  const handleWithdrawProfit = async (poolId: number) => {
    try {
      await withdrawProfitFunc(poolId);
      const data = await getPoolData(stakeId);
      const stakeTokenData = await getTokenData(data.stakingToken);
      const rewardTokenData = await getTokenData(data.rewardToken);
      setStakeTokenData(stakeTokenData);
      setRewardTokenData(rewardTokenData);
      setSuccessMessage("Successfully withdrew profit!");
    } catch (error) {
      handleError(error, "Error in withdrawing profit");
    }
  };

  const handleWithdrawSpecificProfit = async (poolId: number) => {
    try {
      await withdrawSpecificProfitFunc(
        withdrawAmount,
        poolId,
        rewardTokenData.decimal
      );
      const data = await getPoolData(stakeId);
      const stakeTokenData = await getTokenData(data.stakingToken);

      setStakeTokenData(stakeTokenData);
      setRewardTokenData(rewardTokenData);
      setSuccessMessage("Successfully withdrew specific profit!");
    } catch (error) {
      handleError(error, "Error in withdrawing specific profit");
    }
  };

  const handleShowMyBalancesInPool = async (
    poolId: number,
    decimal: number
  ) => {
    try {
      const result = await showMyBalancesInPoolFunc(poolId, decimal);
      setStakeAmount(result);
    } catch (error) {
      handleError(error, "Error in showing my balances in pool");
    }
  };

  const handleCalculateReward = async (poolId: number, decimal: number) => {
    try {
      const result = await calculateRewardFunc(poolId, decimal);
      console.log("Calculating reward called ===> ", result);
      setCalculatedReward(result);
    } catch (error) {
      handleError(error, "Error in calculating reward");
    }
  };

  useEffect(() => {
    if (stakeBtnStatus) {
      const intervalId = setInterval(() => {
        handleCalculateReward(Number(stakeId), rewardTokenData.decimal);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [stakeBtnStatus]);

  const handleAddReferral = async () => {
    try {
      await addReferralFunc(referralAddress);
      setSuccessMessage("Referral added successfully!");
    } catch (error) {
      handleError(error, "Error in adding referral");
    }
  };

  useEffect(() => {
    fetchPoolData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Stake Pool ID: {stakeId}</h2>

      {poolData && (
        <Card className="w-full flex flex-wrap">
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
              <strong>Reward Rate:</strong>{" "}
              {(poolData.rewardRate / 100).toString()}%
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
              <strong>Staking Token Balance:</strong>{" "}
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

      <div className="mt-4">
        <h3 className="text-xl font-semibold">
          Your Current Reward:{" "}
          {calculatedReward !== null && !isNaN(Number(calculatedReward))
            ? Number(calculatedReward).toFixed(6)
            : "Loading..."}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label>Stake Amount:</label>
          <Input
            type="number"
            placeholder="Enter amount"
            onChange={(e) => setStakeAmount(Number(e.target.value))}
          />
          <Button
            onClick={() =>
              handleApproveToken(stakeTokenData.address, stakeTokenData.decimal)
            }
            disabled={!stakeAmount || !stakeTokenData}
          >
            Approve Token
          </Button>
          <Button
            onClick={() => handleStake(Number(stakeId), stakeTokenData.decimal)}
            disabled={!stakeAmount || !stakeBtnStatus}
          >
            Stake
          </Button>
        </div>

        <div>
          <label>Withdraw Specific Profit:</label>
          <Input
            type="number"
            placeholder="Enter amount"
            onChange={(e) => setWithdrawAmount(Number(e.target.value))}
          />
          <Button
            onClick={() => handleWithdrawSpecificProfit(Number(stakeId))}
            disabled={!withdrawAmount}
          >
            Withdraw Specific Profit
          </Button>
        </div>

        <div>
          <Button onClick={() => handleWithdrawAllAmount(Number(stakeId))}>
            Withdraw All Amount
          </Button>
          <Button onClick={() => handleWithdrawProfit(Number(stakeId))}>
            Withdraw Profit
          </Button>
        </div>

        <div>
          <label>Referral Address:</label>
          <Input
            type="text"
            placeholder="Enter referral address"
            value={referralAddress}
            onChange={(e) => setReferralAddress(e.target.value)}
          />
          <Button onClick={handleAddReferral}>Add Referral</Button>
        </div>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

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
