"use client";
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

const Page = () => {
  const [fromToken, setFromToken] = useState("tokenA");
  const [toToken, setToToken] = useState("tokenB");
  const [balanceFrom, setBalanceFrom] = useState(0);
  const [balanceTo, setBalanceTo] = useState(0);
  const [amountFrom, setAmountFrom] = useState("");
  const [amountTo, setAmountTo] = useState("");

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      <Card className="w-96 p-4 rounded-lg">
        <CardContent>
          <div className="space-y-4">
            {/* From Token */}
            <div>
              <label className="block text-white">From</label>
              <div className="flex items-center space-x-2">
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger className="flex-1 bg-gray-700 text-white p-2 rounded">
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tokenA">tokenA</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-right flex-1 text-white">
                  <span>Balance: {balanceFrom}</span>
                </div>
              </div>
              <input
                type="number"
                placeholder="Enter amount"
                value={amountFrom}
                onChange={(e) => setAmountFrom(e.target.value)}
                className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
              />
            </div>

            {/* Swap Button */}
            <div className="text-center">
              <Button variant="outline" className="bg-transparent">
                <ArrowUpDown className="w-5 h-5 mx-auto text-white" />
              </Button>
            </div>

            {/* To Token */}
            <div>
              <label className="block text-white">To</label>
              <div className="flex items-center space-x-2">
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger className="flex-1 bg-gray-700 text-white p-2 rounded">
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tokenB">tokenB</SelectItem>
                    <SelectItem value="DAI">DAI</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-right flex-1 text-white">
                  <span>Balance: {balanceTo}</span>
                </div>
              </div>
              <input
                type="number"
                placeholder="Enter amount"
                value={amountTo}
                onChange={(e) => setAmountTo(e.target.value)}
                className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="space-y-2 mt-4">
          {/* Optional Swap Details */}
          {/* <div className="flex justify-between text-sm text-white">
            <span>Swap Fees 0%:</span>
            <span>0 tokenA</span>
          </div>
          <div className="flex justify-between text-sm text-white">
            <span>Per swap Maxlimit:</span>
            <span>0</span>
          </div> */}
          <Button variant="solid" className="w-full mt-2 bg-purple-600">
            Approve tokenA
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Page;
