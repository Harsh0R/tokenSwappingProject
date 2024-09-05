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
import { ClipboardCopyIcon } from "@heroicons/react/outline";
import { toEth, toEthA, toEthB, toTokenA, toTokenB, toWei } from "@/Utils/utilsFunctions";

const TokenCreationPage = () => {
  const {
    account,
    createToken,
    getAllTokens,
    getTokenData,
    transferTokenToContract,
    hasValideAllowanceForStakingToken,
    increaseAllowanceForStakingToken,
  } = useContext(ContractContext);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState<number>();
  const [decimal, setDecimal] = useState(18);
  const [tokens, setTokens] = useState<any[]>([]);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [amount, setAmount] = useState<number>(0);

  const handleCreateToken = async () => {
    if (
      !name ||
      !symbol ||
      !initialSupply ||
      initialSupply <= 0 ||
      decimal <= 0
    ) {
      setErrorMessage("Please fill all the fields");
      return;
    }

    setErrorMessage("");
    await createToken(name, symbol, initialSupply, decimal);
    setTransactionStatus("Token creation in progress...");
    await fetchTokens();
    setTransactionStatus("Token created successfully!");
  };

  const fetchTokens = async () => {
    const tokenAddresses = await getAllTokens();
    const tokenDetails = await Promise.all(
      tokenAddresses.map(async (address: string) => {
        const data = await getTokenData(address);
        return { ...data, address };
      })
    );
    setTokens(tokenDetails);
  };

  const handleSendToken = async (
    amount: number,
    address: string,
    decimal: number
  ) => {
    if (!amount || !address) {
      alert("Please fill all the required fields");
      return;
    }

    const Validamount = await hasValideAllowanceForStakingToken(address , decimal);

    if(Validamount<amount){
      alert("Insufficient allowance");
      return;
    }

    const tx = await transferTokenToContract(amount, address , decimal);
    setTransactionStatus("Token sent successfully!");
  };

  const handleApproveToken = async (address: string, decimal: number) => {
    if (!address || !amount || !decimal) {
      alert("Please fill all the required fields");
      return;
    }
    console.log("Address =>", address);

    const tx = await increaseAllowanceForStakingToken(address, amount, decimal);

    setTransactionStatus("Token approved successfully!");
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setTransactionStatus(`Address copied: ${address}`);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <h2 className="text-xl font-semibold">Create a New Token</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="Token Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Token Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Initial Supply"
            value={initialSupply}
            onChange={(e) => setInitialSupply(Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Decimals"
            value={decimal}
            onChange={(e) => setDecimal(Number(e.target.value))}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateToken} className="w-full">
            Create Token
          </Button>
        </CardFooter>
        {transactionStatus && (
          <div className="text-center mt-2 text-sm text-gray-600">
            {transactionStatus}
          </div>
        )}
        {errorMessage && (
          <div className="text-center mt-2 text-sm text-red-600">
            {errorMessage}
          </div>
        )}
      </Card>

      <h2 className="text-xl font-semibold">Created Tokens</h2>
      <div className="w-full flex flex-wrap gap-4 justify-center">
        {tokens.length > 0 ? (
          tokens.map((token, index) => (
            <Card key={index} className="p-4 w-full sm:w-1/2 lg:w-1/4">
              <CardContent>
                <div>
                  <strong>Name:</strong> {token.name}
                </div>
                <div>
                  <strong>Symbol:</strong> {token.symbol}
                </div>
                <div>
                  <strong>Supply:</strong> {parseFloat(token.supply).toFixed(4)}
                </div>
                <div>
                  <strong>Balance in Contract:</strong>{" "}
                  {parseFloat(token.balanceOfContract).toFixed(4)}
                </div>
                <div>
                  <strong>Your Balance:</strong>{" "}
                  {parseFloat(token.balanceOfAccount).toFixed(4)}
                </div>
                <div>
                  <strong>Decimals:</strong> {token.decimal}
                </div>
                <div className="flex items-center space-x-2">
                  <strong>Address:</strong>{" "}
                  <span>
                    {token.address.slice(0, 4)}...
                    {token.address.slice(-4)}
                  </span>
                  <Button
                    variant="outline"
                    size={"sm"}
                    onClick={() => handleCopyAddress(token.address)}
                  >
                    <ClipboardCopyIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Amount"
                  className="w-full mb-2"
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
                <Button
                  variant={"outline"}
                  className="w-full my-2"
                  onClick={() =>
                    handleApproveToken(token.address, token.decimal)
                  }
                >
                  Approve Token
                </Button>
                <Button
                  onClick={() =>
                    handleSendToken(amount, token.address, token.decimal)
                  }
                  className="w-full"
                >
                  Send Token
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No tokens created yet.</p>
        )}
      </div>
    </div>
  );
};

export default TokenCreationPage;
