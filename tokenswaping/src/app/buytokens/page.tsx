"use client";

import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { A_DECIMAL, B_DECIMAL, MATIC_DECIMAL } from "@/Utils/utilsFunctions";
import { ContractContext } from "@/Context/contractContect";

// import { yourTokenContractABI } from "@/path/to/your/abi";
// const tokenContractAddress = "YOUR_CONTRACT_ADDRESS";

const Page = () => {
  const [amountMaticTokenA, setAmountMaticTokenA] = useState("");
  const [amountMaticTokenB, setAmountMaticTokenB] = useState("");
  const [amountTokenAMatic, setAmountTokenAMatic] = useState("");
  const [amountTokenBMatic, setAmountTokenBMatic] = useState("");
  const [receivedAmountmaticFromTokenA, setReceivedAmountmaticFromTokenA] = useState("");
  const [receivedAmountmaticFromTokenB, setReceivedAmountmaticFromTokenB] = useState("");
  const [receivedAmountTokenA, setReceivedAmountTokenA] = useState("");
  const [receivedAmountTokenB, setReceivedAmountTokenB] = useState("");
  const [tokenAAmount, setTokenAAmount] = useState("");
  const [tokenBAmount, setTokenBAmount] = useState("");
  const [Aratio, setARatio] = useState("");
  const [Bratio, setBRatio] = useState("");
  const [sellARatio, setSellARatio] = useState("");
  const [sellBRatio, setSellBRatio] = useState("");
  const [feePercentage, setFeePercentage] = useState("");

  // const [transactionStatus, setTransactionStatus] = useState("");

  const {
    account,
    getBuyARatio,
    getBuyBRatio,
    buyTokenA,
    buyTokenB,
    transactionStatus,
    setTransactionStatus,
    getTokenAAmount,
    getTokenBAmount,
    connectToWallet,
    getFeePercentage,
    getSellARatio,
    getSellBRatio,
    sellTokenA,
    sellTokenB,
    increaseAllowance,
  } = useContext(ContractContext);

  const getTokenAAmountFunc = async (account: any) => {
    const result = await getTokenAAmount(account);

    console.log("getTokenAAmount => ", result);

    setTokenAAmount(result);
  };
  const getTokenBAmountFunc = async (account: any) => {
    const result = await getTokenBAmount(account);
    console.log("getTokenBAmount => ", result);
    setTokenBAmount(result);
  };

  const walletConnect = async () => {
    const account = await connectToWallet();
    console.log("account => ", account);
    getTokenAAmountFunc(account);
    getTokenBAmountFunc(account);
    const fee = await getFeePercentage();
    console.log("fee => ", fee);

    setFeePercentage(fee.toString());
    // console.log("tokenAAmount => ", tokenAAmount);
    // console.log("tokenBAmount => ", tokenBAmount);
    const ratioA = await getBuyARatio();
    const a = (ratioA * MATIC_DECIMAL) / A_DECIMAL;
    setARatio(a.toString());
    const ratioB = await getBuyBRatio();
    const b = (ratioB * MATIC_DECIMAL) / B_DECIMAL;
    setBRatio(b.toString());
    const sellratioA = await getBuyARatio();
    const a1 = (sellratioA * MATIC_DECIMAL) / A_DECIMAL;
    setSellARatio(a1.toString());
    const sellratioB = await getBuyBRatio();
    const b1 = (sellratioB * MATIC_DECIMAL) / B_DECIMAL;
    setSellBRatio(b1.toString());
  };

  useEffect(() => {
    walletConnect();
  }, []);

  const handleChangeReceivedAmount = async (e: any, tokenType: any) => {
    const amountMatic = e.target.value;
    if (tokenType === "TokenA") {
      setAmountMaticTokenA(amountMatic);
      const ratio = await getBuyARatio();
      // setARatio(ratio);
      setReceivedAmountTokenA(
        ((amountMatic * ratio * MATIC_DECIMAL) / A_DECIMAL).toFixed(2)
      );
    } else if (tokenType === "TokenB") {
      setAmountMaticTokenB(amountMatic);
      const ratio = await getBuyBRatio();
      // setBRatio(ratio);
      setReceivedAmountTokenB(
        ((amountMatic * ratio * MATIC_DECIMAL) / B_DECIMAL).toFixed(2)
      );
    }
  };
  const handleChangeReceivedmatic = async (e: any, tokenType: any) => {
    const amountMatic = e.target.value;
    if (tokenType === "TokenA") {
      setAmountTokenAMatic(amountMatic);
      const ratio = await getSellARatio();
      // setARatio(ratio);
      setReceivedAmountmaticFromTokenA(
        ((amountMatic * ratio * MATIC_DECIMAL) / A_DECIMAL).toFixed(2)
      );
    } else if (tokenType === "TokenB") {
      setAmountTokenBMatic(amountMatic);
      const ratio = await getSellBRatio();
      // setBRatio(ratio);
      setReceivedAmountmaticFromTokenB(
        ((amountMatic * ratio * MATIC_DECIMAL) / B_DECIMAL).toFixed(2)
      );
    }
  };

  const handleApproveToken = async (tokenType: any, amountMatic: any) => {
    if (
      !amountMatic ||
      isNaN(parseFloat(amountMatic)) ||
      parseFloat(amountMatic) <= 0
    ) {
      setTransactionStatus(
        `Please enter a valid amount of MATIC for ${tokenType}.`
      );
      return;
    }

    try {
        await increaseAllowance(amountMatic.toString() , tokenType);
    
      setTransactionStatus(`Token purchase successful for ${tokenType}!`);
    } catch (error: any) {
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  };
  
  const handleBuyToken = async (tokenType: any, amountMatic: any) => {
    if (
      !amountMatic ||
      isNaN(parseFloat(amountMatic)) ||
      parseFloat(amountMatic) <= 0
    ) {
      setTransactionStatus(
        `Please enter a valid amount of MATIC for ${tokenType}.`
      );
      return;
    }

    try {
      if (tokenType === "TokenA") {
        await buyTokenA(amountMatic);
      } else if (tokenType === "TokenB") {
        await buyTokenB(amountMatic);
      }
      setTransactionStatus(`Token purchase successful for ${tokenType}!`);
    } catch (error: any) {
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  };
  const handleSellToken = async (tokenType: any, amountMatic: any) => {

    console.log("amountMatic => ", amountMatic);
    console.log("tokenType => ", tokenType);
    
    

    if (
      !amountMatic ||
      isNaN(parseFloat(amountMatic)) ||
      parseFloat(amountMatic) <= 0
    ) {
      setTransactionStatus(
        `Please enter a valid amount of MATIC for ${tokenType}.`
      );
      return;
    }

    try {
      if (tokenType === "TokenA") {
        await sellTokenA(amountMatic);
      } else if (tokenType === "TokenB") {
        await sellTokenB(amountMatic);
      }
      setTransactionStatus(`Token purchase successful for ${tokenType}!`);
    } catch (error: any) {
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      <h1 className="text-center text-white mt-4">Buy Tokens</h1>
      <div className="flex flex-row items-center justify-center space-x-5 mt-4">
        <Card className="w-96 p-4 rounded-lg">
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-row items-center justify-center space-x-10">
                <h2 className="text-lg font-semibold text-white">Buy TokenA</h2>
                <div className="text-sm font-semibold text-white">
                  Balance TokenA : {tokenAAmount}
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center justify-space-between space-x-12">
                  <div className="text-align-center">
                    <div className="block text-white">Amount (MATIC)</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="block text-white text-sm">
                      Rate : {Aratio} TokenA
                    </div>
                    <div className="block text-white text-sm">
                      fee : {feePercentage}%
                    </div>
                  </div>
                </div>

                <input
                  type="number"
                  placeholder="Enter amount of MATIC"
                  value={amountMaticTokenA}
                  onChange={(e) => handleChangeReceivedAmount(e, "TokenA")}
                  className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
                />
                {receivedAmountTokenA && (
                  <div className="text-white mt-2">
                    Received: {receivedAmountTokenA} TokenA
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="space-y-2">
            <Button
              variant="outline"
              className="w-full mt-2 bg-purple-600"
              onClick={() => handleBuyToken("TokenA", amountMaticTokenA)}
            >
              Buy TokenA
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-96 p-4 rounded-lg">
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-row items-center justify-center space-x-10">
                <h2 className="text-lg font-semibold text-white">Buy TokenB</h2>
                <div className="text-sm font-semibold text-white">
                  Balance TokenB : {tokenBAmount}
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center justify-space-between space-x-12">
                  <div className="text-align-center">
                    <div className="block text-white">Amount (MATIC)</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="block text-white text-sm">
                      Rate : {Bratio} TokenB
                    </div>
                    <div className="block text-white text-sm">
                      fee : {feePercentage}%
                    </div>
                  </div>
                </div>
                {/* <div className="flex flex-row items-center justify-center space-x-10">
                  <label className="block text-white">Amount (MATIC)</label>
                  <label className="block text-white">Rate : {Bratio}</label>
                </div> */}
                <input
                  type="number"
                  placeholder="Enter amount of MATIC"
                  value={amountMaticTokenB}
                  onChange={(e) => handleChangeReceivedAmount(e, "TokenB")}
                  className="w-full mt-2 p-2 bg-gray-700 text-white rounded"
                />
                {receivedAmountTokenB && (
                  <div className="text-white mt-2">
                    Received: {receivedAmountTokenB} TokenB
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="space-y-2">
            <Button
              variant="solid"
              className="w-full mt-2 bg-purple-600"
              onClick={() => handleBuyToken("TokenB", amountMaticTokenB)}
            >
              Buy TokenB
            </Button>
          </CardFooter>
        </Card>
      </div>

      <h1 className="text-center text-white mt-4">Sell Tokens</h1>
      <div className="flex flex-row items-center justify-center space-x-5 mt-4">
        <Card className="w-96 p-4 rounded-lg">
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Sell TokenA
                </h2>
                <div className="text-sm font-semibold text-white">
                  Balance TokenA : {tokenAAmount}
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center justify-between ">
                  <div className="text-align-center">
                    <div className="block text-white">Amount (TokenA)</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="block text-white text-sm">
                      Rate : {sellARatio} MATIC
                    </div>
                    <div className="block text-white text-sm">
                      fee : {feePercentage}%
                    </div>
                  </div>
                </div>
                {/* <label className="block text-white">Amount (TokenA)</label> */}
                <input
                  type="number"
                  placeholder="Enter amount of TokenA"
                  value={amountTokenAMatic}
                  onChange={(e) => handleChangeReceivedmatic(e, "TokenA")}
                  className="w-full mt-4 p-2 bg-black text-white rounded border-2"
                />
                {receivedAmountmaticFromTokenA && (
                  <div className="text-white mt-2">
                    Received: {receivedAmountmaticFromTokenA} MATIC
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className=" flex flex-col mt-2">
            <Button
              variant={"outline"}
              className="w-full mt-2"
              onClick={() => handleApproveToken("TokenA", tokenAAmount)}
            >
              Approve TokenA
            </Button>
            <Button
              variant={"outline"}
              className="w-full mt-2"
              onClick={() => handleSellToken("TokenA", amountTokenAMatic)}
            >
              Sell TokenA
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-96 p-4 rounded-lg">
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-row items-center justify-center space-x-10">
                <h2 className="text-lg font-semibold text-white">
                  Sell TokenB
                </h2>
                <div className="text-sm font-semibold text-white">
                  Balance TokenB : {tokenBAmount}
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center justify-space-between space-x-12">
                  <div className="text-align-center">
                    <div className="block text-white">Amount (TokenB)</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="block text-white text-sm">
                      Rate : {sellBRatio} MATIC
                    </div>
                    <div className="block text-white text-sm">
                      fee : {feePercentage}%
                    </div>
                  </div>
                </div>
                {/* <label className="block text-white">Amount (TokenB)</label> */}
                <input
                  type="number"
                  placeholder="Enter amount of TokenB"
                  value={amountTokenBMatic}
                  onChange={(e) => handleChangeReceivedmatic(e, "TokenB")}
                  className="w-full mt-2 p-2 bg-black text-white rounded border-2  "
                />
                {receivedAmountmaticFromTokenB && (
                  <div className="text-white mt-2">
                    Received: {receivedAmountmaticFromTokenB} MATIC
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className=" flex flex-col mt-2">
            <Button
              variant={'outline'}
              className="w-full mt-2"
              onClick={() => handleApproveToken("TokenB", tokenBAmount)}
            >
              Approve TokenB
            </Button>
            <Button
              variant={'outline'}
              className="w-full mt-2"
              onClick={() => handleSellToken("TokenB", amountTokenBMatic)}
            >
              Sell TokenB
            </Button>
          </CardFooter>
        </Card>
      </div>

      {transactionStatus && (
        <div className="text-center text-white mt-4">{transactionStatus}</div>
      )}
    </div>
  );
};

export default Page;
