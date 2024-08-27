"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";

// Import your smart contract ABI and address
// import { yourTokenContractABI } from "@/path/to/your/abi";
// const tokenContractAddress = "YOUR_CONTRACT_ADDRESS";

const Page = () => {
  const [amountMaticTokenA, setAmountMaticTokenA] = useState("");
  const [amountMaticTokenB, setAmountMaticTokenB] = useState("");
  const [receivedAmountTokenA, setReceivedAmountTokenA] = useState("");
  const [receivedAmountTokenB, setReceivedAmountTokenB] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");

  const getConversionRate = async (token: string) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        "YOUR_CONTRACT_ADDRESS", // Replace with your contract address
        [
          "function getConversionRate(address token) public view returns (uint256)", // Replace with your contract ABI
        ],
        provider
      );

      const rate = await contract.getConversionRate(token);
      return rate; // This should return the rate in the smallest unit (e.g., 18 decimals)
    } catch (error) {
      console.error(`Failed to fetch conversion rate for ${token}:`, error);
      return ethers.BigNumber.from(0);
    }
  };

  const updateTokenAmount = async (amountMatic: string, token: string, setReceivedAmount: (amount: string) => void) => {
    if (!amountMatic || isNaN(parseFloat(amountMatic)) || parseFloat(amountMatic) <= 0) {
      setReceivedAmount("");
      return;
    }

    try {
      const rate = await getConversionRate(token);
      const amountInWei = ethers.utils.parseEther(amountMatic);
      const amountTokens = amountInWei.mul(rate).div(ethers.constants.WeiPerEther); // Adjust for decimal places if necessary
      const formattedAmountTokens = ethers.utils.formatUnits(amountTokens, 18); // Adjust decimal places as needed
      setReceivedAmount(formattedAmountTokens);
    } catch (error) {
      console.error(`Failed to update token amount:`, error);
      setReceivedAmount("");
    }
  };

  useEffect(() => {
    updateTokenAmount(amountMaticTokenA, "TokenA", setReceivedAmountTokenA);
  }, [amountMaticTokenA]);

  useEffect(() => {
    updateTokenAmount(amountMaticTokenB, "TokenB", setReceivedAmountTokenB);
  }, [amountMaticTokenB]);

  const handleBuyToken = async (token: string, amountMatic: string) => {
    if (!amountMatic || isNaN(parseFloat(amountMatic)) || parseFloat(amountMatic) <= 0) {
      setTransactionStatus(`Please enter a valid amount of MATIC for ${token}.`);
      return;
    }

    try {
      // Connect to the user's Ethereum wallet
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Define your contract and method
      const tokenContract = new ethers.Contract(
        "YOUR_CONTRACT_ADDRESS", // Replace with your contract address
        ["function buyToken(address token) public payable"], // Replace with your contract ABI
        signer
      );

      const amountInWei = ethers.utils.parseEther(amountMatic);

      // Execute the buyToken method
      const tx = await tokenContract.buyToken(token, { value: amountInWei });
      await tx.wait();

      setTransactionStatus(`Token purchase successful for ${token}!`);
    } catch (error) {
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      <div className="flex flex-row items-center justify-center space-x-5">
        {/* Box for TokenA */}
        <Card className="w-96 p-4 rounded-lg">
          <CardContent>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Buy TokenA</h2>
              <div>
                <label className="block text-white">Amount (MATIC)</label>
                <input
                  type="number"
                  placeholder="Enter amount of MATIC"
                  value={amountMaticTokenA}
                  onChange={(e) => setAmountMaticTokenA(e.target.value)}
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
          <CardFooter className="space-y-2 mt-4">
            <Button
              variant="solid"
              className="w-full mt-2 bg-purple-600"
              onClick={() => handleBuyToken("TokenA", amountMaticTokenA)}
            >
              Buy TokenA
            </Button>
          </CardFooter>
        </Card>

        {/* Box for TokenB */}
        <Card className="w-96 p-4 rounded-lg">
          <CardContent>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Buy TokenB</h2>
              <div>
                <label className="block text-white">Amount (MATIC)</label>
                <input
                  type="number"
                  placeholder="Enter amount of MATIC"
                  value={amountMaticTokenB}
                  onChange={(e) => setAmountMaticTokenB(e.target.value)}
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
          <CardFooter className="space-y-2 mt-4">
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

      {/* Transaction Status */}
      {transactionStatus && (
        <div className="text-center text-white mt-4">
          {transactionStatus}
        </div>
      )}
    </div>
  );
}

export default Page;
