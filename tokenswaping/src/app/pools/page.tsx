"use client";
import React, { useContext, useState, useEffect } from "react";
import { ContractContext } from "@/Context/contractContect";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const PoolPage = () => {
  const {
    createPool,
    getAllTokens,
    getTokenData,
    getAllPoolsId,
    getPoolData,
    stopPool,
  } = useContext(ContractContext);

  const [stakingToken, setStakingToken] = useState<string | null>(null);
  const [rewardToken, setRewardToken] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [rewardRate, setRewardRate] = useState<number>(0);
  const [tokens, setTokens] = useState<any[]>([]);
  const [pools, setPools] = useState<any[]>([]);
  const [transactionStatus, setTransactionStatus] = useState("");

  const fetchTokens = async () => {
    try {
      const tokenAddresses = await getAllTokens();

      // Check if tokenAddresses is valid and is an array
      if (!tokenAddresses || !Array.isArray(tokenAddresses)) {
        console.log("Invalid or empty token addresses array");
        setTokens([]); // Set an empty array to avoid breaking the UI
        return;
      }

      const tokenDetails = await Promise.all(
        tokenAddresses.map(async (address: string) => {
          const data = await getTokenData(address);
          return { ...data, address };
        })
      );

      setTokens(tokenDetails);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      setTokens([]); // Set an empty array in case of error
    }
  };

  const handleCreatePool = async () => {
    if (
      !stakingToken ||
      !rewardToken ||
      !duration ||
      !rewardRate ||
      duration <= 0 ||
      rewardRate <= 0
    ) {
      alert("Please fill all the required fields");
      return;
    }

    const tx = await createPool(
      stakingToken,
      rewardToken,
      duration,
      rewardRate * 100
    );

    fetchPools();
  };

  const fetchPools = async () => {
    try {
      const poolsId = await getAllPoolsId();

      // Check if poolsId is valid
      if (!poolsId || poolsId.length === 0) {
        console.log("No pool IDs returned from the contract");
        setPools([]);
        return;
      }

      const poolDetails = await Promise.all(
        poolsId.map(async (id: number) => {
          const data = await getPoolData(id);
          const stakeTokenData = await getTokenData(data.stakingToken);
          const rewardTokenData = await getTokenData(data.rewardToken);

          return {
            id: data.poolId ? data.poolId.toString() : "N/A",
            duration: data.duration ? data.duration.toString() : "N/A",
            rewardRate: data.rewardRate ? data.rewardRate.toString() : "N/A",
            stakingToken: stakeTokenData.name || "N/A",
            rewardToken: rewardTokenData.name || "N/A",
            minStakeAmount: data.minStakeAmount
              ? data.minStakeAmount.toString()
              : "N/A",
            active: data.active || false,
          };
        })
      );
      setPools(poolDetails);
    } catch (error) {
      console.error("Error fetching pools:", error);
      setPools([]); // Clear the pool data if an error occurs
    }
  };

  const handleStopPool = async (poolId: number) => {
    if (!poolId) {
      alert("Please select a pool to stop");
      return;
    }

    const tx = await stopPool(poolId);
    setTransactionStatus("Pool stopped successfully!");
  };

  useEffect(() => {
    fetchTokens();
    fetchPools();
  }, []);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      {/* Pool Creation Form */}
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <h2 className="text-xl font-semibold">Create a Staking Pool</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <Select onValueChange={setStakingToken}>
            <SelectTrigger>
              <SelectValue placeholder="Select Staking Token" />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((token) => (
                <SelectItem key={token.address} value={token.address}>
                  {token.name} ({token.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setRewardToken}>
            <SelectTrigger>
              <SelectValue placeholder="Select Reward Token" />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((token) => (
                <SelectItem key={token.address} value={token.address}>
                  {token.name} ({token.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Duration (in seconds)"
            value={duration === 0 ? "" : duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Reward Rate"
            value={rewardRate === 0 ? "" : rewardRate}
            onChange={(e) => setRewardRate(Number(e.target.value))}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreatePool} className="w-full">
            Create Pool
          </Button>
        </CardFooter>
      </Card>

      {/* Display All Pools */}
      <div className="w-full max-w-4xl space-y-4">
        <h2 className="text-2xl font-semibold">All Staking Pools</h2>
        {pools.length > 0 ? (
          pools.map((pool) => (
            <Card key={pool.id} className="p-4">
              <CardHeader>
                <h3 className="text-xl font-semibold">Pool ID: {pool.id}</h3>
              </CardHeader>
              <CardContent className="flex flex-raw justify-between">
                <div>
                  <p>
                    <strong>Staking Token:</strong> {pool.stakingToken}
                  </p>
                  <p>
                    <strong>Reward Token:</strong> {pool.rewardToken}
                  </p>
                  <p>
                    <strong>Duration:</strong> {pool.duration} seconds
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Reward Rate:</strong> {pool.rewardRate}
                  </p>
                  <p>
                    <strong>Minimum Stake Amount:</strong> {pool.minStakeAmount}
                  </p>
                  <p>
                    <strong>Active:</strong> {pool.active ? "Open" : "Stopped"}
                  </p>
                </div>
              </CardContent>
              {pool.active == false ? (
                <div>
                  <Button
                    variant={"secondary"}
                    onClick={() => handleStopPool(pool.id)}
                    className="w-full"
                  >
                    Start Pool
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    variant={"destructive"}
                    onClick={() => handleStopPool(pool.id)}
                    className="w-full"
                  >
                    Stop Pool
                  </Button>
                </div>
              )}
            </Card>
          ))
        ) : (
          <p>No pools available</p>
        )}
      </div>
    </div>
  );
};

export default PoolPage;
