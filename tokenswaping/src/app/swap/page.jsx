"use client";
import React, { use, useContext, useEffect, useState } from "react";
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
import { ContractContext } from "@/Context/contractContect";
import { A_DECIMAL, B_DECIMAL, MATIC_DECIMAL } from "@/Utils/utilsFunctions";

const Page = () => {
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [amountFrom, setAmountFrom] = useState("");
  const [amountTo, setAmountTo] = useState("");
  const [approveToken, setApproveToken] = useState('');
  const [swapRatio, setSwapRatio] = useState(0);
  const [tokenABalance, setTokenABalance] = useState(0);
  const [tokenBBalance, setTokenBBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const { contract, getTokenAAddress, getTokenBAddress, connectToWallet, account, getBuyARatio, getBuyBRatio, buyTokenA, buyTokenB, transactionStatus, setTransactionStatus, getTokenAAmount, getTokenBAmount, getFeePercentage, getSellARatio, getSellBRatio, sellTokenA, sellTokenB, hasValideAllowance, increaseAllowance, getAtoBSwapRatio, getBtoASwapRatio, swapTokenAToTokenB, swapTokenBToTokenA, setMaxSwapAmountForTokenAFunc, setMaxSwapAmountForTokenBFunc } = useContext(ContractContext);

  const getTokenBalance = async () => {
    const balA = await getTokenAAmount(account);
    setTokenABalance(parseFloat(balA).toFixed(3))
    const balB = await getTokenBAmount(account);
    setTokenBBalance(parseFloat(balB).toFixed(3));
  }

  const limitDecimals = (value, decimals) => {
    const regex = new RegExp(`^\\d*(\\.\\d{0,${decimals}})?`);
    return value.match(regex)[0] || "";
  };


  const getSwapRatio = async () => {
    if (fromToken === 'tokenA' && toToken === 'tokenB') {
      const ratio = await getAtoBSwapRatio();
      console.log("ratio A-B => ", ratio);
      setSwapRatio(ratio);
    } else if (fromToken === 'tokenB' && toToken === 'tokenA') {
      const ratio = await getBtoASwapRatio();
      console.log("ratio B-A => ", ratio);
      setSwapRatio(ratio);
    } else if (fromToken === 'tokenA' && toToken === 'matic') {
      const ratio = await getSellARatio();
      console.log("ratio A-MATIC => ", ratio);
      setSwapRatio(ratio);
    } else if (fromToken === 'tokenB' && toToken === 'matic') {
      const ratio = await getSellBRatio();
      console.log("ratio B-MATIC => ", ratio);
      setSwapRatio(ratio);
    } else if (fromToken === 'matic' && toToken === 'tokenA') {
      const ratio = await getBuyARatio();
      console.log("ratio A-MATIC => ", ratio);
      setSwapRatio(ratio);
    } else if (fromToken === 'matic' && toToken === 'tokenB') {
      const ratio = await getBuyBRatio();
      console.log("ratio matic-B => ", ratio);
      setSwapRatio(ratio);
    }
  }
  useEffect(() => {
    getTokenBalance();
  }, [account])

  useEffect(() => {
    getSwapRatio();
    setApproveToken(fromToken);
    setAmountTo((parseFloat(amountFrom) * swapRatio).toString());
  }, [fromToken, amountFrom, toToken]);

  const handleFromAmountChange = (e) => {
    const value = e.target.value;

    let decimals;
    if (fromToken === "tokenA") {
      decimals = A_DECIMAL;
    } else if (fromToken === "tokenB") {
      decimals = B_DECIMAL;
    } else if (fromToken === "matic") {
      decimals = MATIC_DECIMAL;
    }
    const limitedValue = limitDecimals(value, decimals);
    setAmountFrom(limitedValue);
  };


  const swapTokens = () => {
    const fromT = fromToken;
    const toT = toToken;
    const fromA = amountFrom;
    const toA = amountTo;

    setAmountFrom(toA);
    setAmountTo(fromA);
    setFromToken(toT);
    setToToken(fromT);
  }

  const handleApproveTokenFunc = async () => {
    if (fromToken === 'tokenA') {
      await increaseAllowance(tokenABalance.toString(), 'TokenA');
    } else if (fromToken === 'tokenB') {
      await increaseAllowance(tokenBBalance.toString(), 'TokenB');
    } else {
      console.log("Invalid Token choice for token approval");
      // await increaseAllowance(balanceFrom.toString() ,'MATIC');
    }
  }

  const handleSwapTokenFunc = async () => {
    setLoading(true);
    if (fromToken === 'tokenA' && toToken === 'tokenB') {
      await swapTokenAToTokenB(amountFrom);
    } else if (fromToken === 'tokenB' && toToken === 'tokenA') {
      await swapTokenBToTokenA(amountFrom);
    } else if (fromToken === 'matic' && toToken === 'tokenA') {
      await buyTokenA(amountFrom);
    } else if (fromToken === 'matic' && toToken === 'tokenB') {
      await buyTokenB(amountFrom);
    } else if (fromToken === 'tokenA' && toToken === 'matic') {
      await sellTokenA(amountFrom);
    } else if (fromToken === 'tokenB' && toToken === 'matic') {
      await sellTokenB(amountFrom);
    } else {
      console.log("Invalid Token choice");
      setLoading(false)
    }
    setLoading(false);
  }



  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      <Card className="w-96 p-4 rounded-lg">
        <div className="flex justify-between bg-black border-2 rounded-lg border-white/20 dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-3 lg:dark:bg-zinc-800/30">
          <div className="p-2 text-white" >TokenA = {tokenABalance}</div>
          <div className="p-2 text-white" >TokenB = {tokenBBalance}</div>
        </div>
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
                    {toToken === 'tokenA' ? <SelectItem disabled value="tokenA">tokenA</SelectItem> : <SelectItem value="tokenA">tokenA</SelectItem>}
                    {toToken === 'tokenB' ? <SelectItem disabled value="tokenB">tokenB</SelectItem> : <SelectItem value="tokenB">tokenB</SelectItem>}
                    {toToken === 'matic' ? <SelectItem disabled value="matic">MATIC</SelectItem> : <SelectItem value="matic">MATIC</SelectItem>}
                  </SelectContent>
                </Select>
                {/* <div className="text-right flex-1 text-white">
                  <span>Balance: {balanceFrom}</span>
                </div> */}
              </div>
              <input
                type="number"
                placeholder="Enter amount"
                value={amountFrom}
                onChange={handleFromAmountChange}
                className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
              />
            </div>

            {/* Swap Button */}
            <div className="text-center">
              <Button variant="outline" className="bg-transparent" onClick={swapTokens}>
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
                    {fromToken === 'tokenA' ? <SelectItem disabled value="tokenA">tokenA</SelectItem> : <SelectItem value="tokenA">tokenA</SelectItem>}
                    {fromToken === 'tokenB' ? <SelectItem disabled value="tokenB">tokenB</SelectItem> : <SelectItem value="tokenB">tokenB</SelectItem>}
                    {fromToken === 'matic' ? <SelectItem disabled value="matic">MATIC</SelectItem> : <SelectItem value="matic">MATIC</SelectItem>}

                  </SelectContent>
                </Select>
                {/* <div className="text-right flex-1 text-white">
                  <span>Balance: {balanceTo}</span>
                </div> */}
              </div>
              <input
                type="number"
                placeholder="Enter amount"
                value={amountTo}
                readOnly={true}
                className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 mt-4">
          {/* Optional Swap Details */}
          {/* <div className="flex justify-between text-sm text-white">
            <span>Swap Fees 0%:</span>
            <span>0 tokenA</span>
          </div>
          <div className="flex justify-between text-sm text-white">
            <span>Per swap Maxlimit:</span>
            <span>0</span>
          </div> */}
          {/* <div className=""> */}
          {fromToken &&
            fromToken !== 'matic' && (
              <>
                <Button variant="secondary" className="w-full mt-2" onClick={handleApproveTokenFunc} >
                  Approve {approveToken}
                </Button>
              </>
            )
          }
          {/* <Button variant="solid" className="w-full mt-2 bg-purple-600" onClick={handleApproveTokenFunc} >
            Approve {approveToken}
          </Button> */}
          {
            loading ? (
              <Button variant="default" className="w-full mt-2" disabled>
                Swap
              </Button>
            ) : (
              <Button variant="default" className="w-full mt-2" onClick={handleSwapTokenFunc} >
                Swap
              </Button>
            )
          }
          {/* <Button variant="default" className="w-full mt-2" onClick={handleSwapTokenFunc} >
            Swap
          </Button> */}

          {/* </div> */}
        </CardFooter>
      </Card>
    </div>
  );
}

export default Page;
