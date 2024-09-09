"use client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ContractContext } from "@/Context/contractContect";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const StakePage = () => {
  const {
    createPool,
    getAllTokens,
    getTokenData,
    getAllPoolsId,
    getPoolData,
    stopPool,
  } = useContext(ContractContext);

  const [pools, setPools] = useState<any[]>([]);
  const router = useRouter();
  

  const fetchPools = async () => {
    try {
      const poolsId = await getAllPoolsId();
      console.log("Pools ID:", poolsId); // Debugging log

      // Ensure poolsId is an array before calling map
      if (!poolsId || !Array.isArray(poolsId)) {
        console.error("Invalid poolsId: Not an array or undefined");
        setPools([]); // Avoid breaking the UI by setting an empty array
        return;
      }

      const poolDetails = await Promise.all(
        poolsId.map(async (id: number) => {
          const data = await getPoolData(id);
          const stakeTokenData = await getTokenData(data.stakingToken);
          const rewardTokenData = await getTokenData(data.rewardToken);

          return {
            id: data.poolId ? data.poolId.toString() : "N/A", // Convert BigNumber to string with fallback
            duration: data.duration ? data.duration.toString() : "N/A", // Convert BigNumber to string with fallback
            rewardRate: data.rewardRate ? data.rewardRate.toString() : "N/A", // Convert BigNumber to string with fallback
            stakingToken: stakeTokenData.name || "N/A", // Fallback to 'N/A' if undefined
            rewardToken: rewardTokenData.name || "N/A", // Fallback to 'N/A' if undefined
            minStakeAmount: data.minStakeAmount
              ? data.minStakeAmount.toString()
              : "N/A", // Convert BigNumber to string with fallback
            active: data.active || false, // Fallback to false if undefined
          };
        })
      );
      setPools(poolDetails);
    } catch (error) {
      console.error("Error fetching pools:", error);
      setPools([]); // Avoid breaking the UI by setting an empty array
    }
  };

  const handleStakePool = async (poolId: number) => {
    try {
      router.push(`/stake/${poolId}`);
    } catch (error) {
      console.error("Error creating pool:", error);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-semibold">All Staking Pools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pools.length > 0 ? (
          pools.map((pool) => (
            <Card key={pool.id} className="p-4">
              <CardHeader>
                <h3 className="text-xl font-semibold">Pool ID: {pool.id}</h3>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
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
              <div>
                <Button
                  variant={"secondary"}
                  onClick={() => handleStakePool(pool.id)}
                  className="w-full"
                >
                  Stake
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p>No pools available</p>
        )}
      </div>
    </div>
  );
};

export default StakePage;
