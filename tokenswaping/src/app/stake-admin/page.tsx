"use client";

import { ContractContext } from "@/Context/contractContect";
import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const StakeAdmin = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any[]>([]); // Initialize as an empty array

  const { getUserData } = useContext(ContractContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const allData = await getUserData();
        if (Array.isArray(allData)) {
          setUserData(allData); // Store the fetched data if it's an array
        } else {
          console.error("Fetched data is not an array:", allData);
        }
        console.log("All data =>", allData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Stake Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {userData.map((data, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>User: {data.user}</CardTitle>
              <CardDescription>ID: {data.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Pool ID: {data.poolId}</p>
              <p>Block Timestamp: {data.blockTimestamp}</p>
              <p>Referred By: {data.referredBy}</p>
              <p>Withdrawn Profit: {data.withdrawnProfit}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StakeAdmin;
