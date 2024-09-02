"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContractContext } from "@/Context/contractContect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { useContext, useEffect, useState } from "react";

const Page = () => {
  const [inToken, setInToken] = useState("");

  const [tokenAAmountLimit, setTokenAAmountLimit] = useState("");
  const [buyARatioVar, setBuyARatioVar] = useState("");
  const [buyBRatioVar, setBuyBRatioVar] = useState("");
  const [atoBSwapRatioVar, setAtoBSwapRatioVar] = useState("");
  const [btoASwapRatioVar, setBtoASwapRatioVar] = useState("");
  const [sellARatioVar, setSellARatioVar] = useState("");
  const [sellBRatioVar, setSellBRatioVar] = useState("");
  const [atoBSwapRatioAsDefaultVar, setAtoBSwapRatioAsDefaultVar] =
    useState("");
  const [btoASwapRatioAsDefaultVar, setBtoASwapRatioAsDefaultVar] =
    useState("");
  const [sellARatioAsDefaultVar, setSellARatioAsDefaultVar] = useState("");
  const [sellBRatioAsDefaultVar, setSellBRatioAsDefaultVar] = useState("");
  const [feePercentageVar, setFeePercentageVar] = useState("");
  const [feeAddressVar, setFeeAddressVar] = useState("");
  const [errorLogs, setErrorLogs] = useState("");

  const {
    setMaxSwapAmountForTokenAFunc,
    setMaxSwapAmountForTokenBFunc,
    setBuyARatio,
    setBuyBRatio,
    setAtoBSwapRatio,
    setBtoASwapRatio,
    setSellARatio,
    setSellBRatio,
    setAtoBSwapRatioAsDefault,
    setBtoASwapRatioAsDefault,
    setSellARatioAsDefault,
    setSellBRatioAsDefault,
    setFeePercentage,
    setFeeAddress,
    getFeeAddress,
    getMaxSwapAmountForA,
    getBuyARatio,
    getBuyBRatio,
    getAtoBSwapRatio,
    getBtoASwapRatio,
    getSellARatio,
    getSellBRatio,
    getFeePercentage,
  } = useContext(ContractContext);

  useEffect(() => {
    const getAtoBSwapRatioAsDefaultFunc = async () => {
      const result = await getAtoBSwapRatio();
      setAtoBSwapRatioAsDefaultVar(result);
    };
    const getBtoASwapRatioAsDefaultFunc = async () => {
      const result = await getBtoASwapRatio();
      setBtoASwapRatioAsDefaultVar(result);
    };
    const getSellARatioAsDefaultFunc = async () => {
      const result = await getSellARatio();
      setSellARatioAsDefaultVar(result);
    };
    const getSellBRatioAsDefaultFunc = async () => {
      const result = await getSellBRatio();
      setSellBRatioAsDefaultVar(result);
    };
    const getFeeAddressFunc = async () => {
      const result = await getFeeAddress();
      setFeeAddressVar(result);
    };
    const getMaxSwapAmountForAFunc = async () => {
      const result = await getMaxSwapAmountForA();
      setTokenAAmountLimit(result);
    };

    const getBuyARatioFunc = async () => {
      const result = await getBuyARatio();
      setBuyARatioVar(result);
    };
    const getBuyBRatioFunc = async () => {
      const result = await getBuyBRatio();
      setBuyBRatioVar(result);
    };
    const getAtoBSwapRatioFunc = async () => {
      const result = await getAtoBSwapRatio();
      setAtoBSwapRatioVar(result);
    };
    const getBtoASwapRatioFunc = async () => {
      const result = await getBtoASwapRatio();
      setBtoASwapRatioVar(result);
    };
    const getSellARatioFunc = async () => {
      const result = await getSellARatio();
      setSellARatioVar(result);
    };
    const getSellBRatioFunc = async () => {
      const result = await getSellBRatio();
      setSellBRatioVar(result);
    };

    const getFeePercentageFunc = async () => {
      const result = await getFeePercentage();
      console.log("res ==> ", result);
      setFeePercentageVar(result);
    };

    getAtoBSwapRatioAsDefaultFunc();
    getBtoASwapRatioAsDefaultFunc();
    getSellARatioAsDefaultFunc();
    getSellBRatioAsDefaultFunc();
    getFeeAddressFunc();
    getMaxSwapAmountForAFunc();
    getBuyARatioFunc();
    getBuyBRatioFunc();
    getAtoBSwapRatioFunc();
    getBtoASwapRatioFunc();
    getSellARatioFunc();
    getSellBRatioFunc();
    getFeePercentageFunc();
  }, []);

  const handleSetTokenASwapAmount = (tokenType: string, amount: any) => {
    console.log("called");
    console.log("tokenType => ", tokenType);

    if (tokenType === "tokenA") {
      setMaxSwapAmountForTokenAFunc(amount);
    } else if (tokenType === "tokenB") {
      setMaxSwapAmountForTokenBFunc(amount);
    }
  };
  const handleSetBuyARatio = () => {
    setBuyARatio(buyARatioVar);
  };
  const handleSetBuyBRatio = () => {
    setBuyBRatio(buyBRatioVar);
  };
  const handleSetAtoBSwapRatio = () => {
    setAtoBSwapRatio(atoBSwapRatioVar);
  };
  const handleSetBtoASwapRatio = () => {
    setBtoASwapRatio(btoASwapRatioVar);
  };
  const handleSetSellARatio = () => {
    setSellARatio(sellARatioVar);
  };
  const handleSetSellBRatio = () => {
    setSellBRatio(sellBRatioVar);
  };
  const handleSetAtoBSwapRatioAsDefault = () => {
    setAtoBSwapRatioAsDefault(atoBSwapRatioAsDefaultVar);
  };
  const handleSetBtoASwapRatioAsDefault = () => {
    setBtoASwapRatioAsDefault(btoASwapRatioAsDefaultVar);
  };
  const handleSetSellARatioAsDefault = () => {
    setSellARatioAsDefault(sellARatioAsDefaultVar);
  };
  const handleSetSellBRatioAsDefault = () => {
    setSellBRatioAsDefault(sellBRatioAsDefaultVar);
  };
  const handleSetFeePercentage = () => {
    const minFeePercentage = 0.001;
    if (parseFloat(feePercentageVar) < minFeePercentage) {
      setErrorLogs(`Fee percentage cannot be less than ${minFeePercentage}%`);
      return;
    }

    setErrorLogs("");
    setFeePercentage(feePercentageVar);
  };
  const handleSetFeeAddress = () => {
    setFeeAddress(feeAddressVar);
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    const minFeePercentage = 0.001;

    setFeePercentageVar(value);

    // Validate the input value
    if (parseFloat(value) < minFeePercentage) {
      setErrorLogs(`Fee percentage cannot be less than ${minFeePercentage}%`);
    } else {
      setErrorLogs(""); // Clear the error message if the value is valid
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      <h1 className="w-full text-xl font-bold mb-4">Admin Page</h1>

      <div className="flex max-w-2xl w-full relative mx-auto items-rounded-lg mt-6 gap-20 border-2 border-[#33333362] bg-[#10050588] cardbox before:h-full before:-left-[2px] before:absolute before:top-0 before:w-[2px] before:z-[2] after:h-full after:absolute after:-right-[2px] after:top-0 after:w-[2px] after:z-[2px] rounded-md cardbox">
        {/* <div className="bg-box h-full left-0 opacity-40 absolute top-0 w-full -z-10"></div> */}

        <div className=" flex flex-col w-full justify-between  items-center px-3 sm:px-5 py-4 rounded-md relative ">
          <div className="flex items-center mt-8 sm:mt-5 justify-between w-full">
            <div className="flex flex-col items-center justify-center rounded-lg space-y-2">
              <div className=" flex text-white rounded-lg shadow-md items-center">
                <div className="text-white mr-2 rounded-lg shadow-md">
                  Set In token limit
                </div>
                <Select value={inToken} onValueChange={setInToken}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tokenA">TokenA</SelectItem>
                    <SelectItem value="tokenB">TokenB</SelectItem>
                    <SelectItem value="matic">MATIC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                placeholder="Enter Amount"
                className="bg-gray-900 text-white rounded-lg"
                onChange={(e) => setTokenAAmountLimit(e.target.value)}
              />
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg">
              <Button
                variant="outline"
                className="tech_btn cnctwlthedBtn flex items-center border-none rounded-full h-12 outline-none relative w-40 active:translate-y-1 active:scale-90 duration-150 ease-linear"
                onClick={() =>
                  handleSetTokenASwapAmount(inToken, tokenAAmountLimit)
                }
              >
                <i></i>
                <i></i>
                <span className="items-center bg-[#000000a6] rounded-full flex justify-center left-0 capitalize overflow-hidden font-medium">
                  Submit
                </span>
              </Button>
            </div>
          </div>

          <div className="flex items-center mt-8 sm:mt-5 justify-between w-full">
            <div className="flex flex-col items-left justify-center rounded-lg space-y-2">
              <div className="text-white rounded-lg shadow-md">
                Set Swap A to B Ratio :
              </div>
              <Input
                placeholder="Enter Amount"
                className="bg-gray-900 text-white rounded-lg"
                onChange={(e) => setAtoBSwapRatioVar(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg">
              <Button
                variant="outline"
                className="tech_btn cnctwlthedBtn flex items-center border-none rounded-full h-12 outline-none relative w-40 active:translate-y-1 active:scale-90 duration-150 ease-linear"
                onClick={handleSetAtoBSwapRatio}
              >
                <i></i>
                <i></i>
                <span className="items-center bg-[#000000a6] rounded-full flex justify-center left-0 capitalize overflow-hidden font-medium">
                  Submit
                </span>
              </Button>
            </div>
          </div>

          <div className="flex items-center mt-8 sm:mt-5 justify-between w-full">
            <div className="flex flex-col items-left justify-center rounded-lg space-y-2">
              <div className="text-white rounded-lg shadow-md">
                Set Swap B to A Ratio :
              </div>
              <Input
                placeholder="Enter Amount"
                className="bg-gray-900 text-white rounded-lg"
                onChange={(e) => setBtoASwapRatioVar(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg">
              <Button
                variant="outline"
                className="tech_btn cnctwlthedBtn flex items-center border-none rounded-full h-12 outline-none relative w-40 active:translate-y-1 active:scale-90 duration-150 ease-linear"
                onClick={handleSetBtoASwapRatio}
              >
                <i></i>
                <i></i>
                <span className="items-center bg-[#000000a6] rounded-full flex justify-center left-0 capitalize overflow-hidden font-medium">
                  Submit
                </span>
              </Button>
            </div>
          </div>

          <div className="flex items-center mt-8 sm:mt-5 justify-between w-full">
            <div className="flex flex-col items-left justify-center rounded-lg space-y-2">
              <div className="text-white rounded-lg shadow-md">
                Set buy A Ratio :
              </div>
              <Input
                placeholder="Enter Amount"
                className="bg-gray-900 text-white rounded-lg"
                onChange={(e) => setBuyARatioVar(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg">
              <Button
                variant="outline"
                className="tech_btn cnctwlthedBtn flex items-center border-none rounded-full h-12 outline-none relative w-40 active:translate-y-1 active:scale-90 duration-150 ease-linear"
                onClick={handleSetBuyARatio}
              >
                <i></i>
                <i></i>
                <span className="items-center bg-[#000000a6] rounded-full flex justify-center left-0 capitalize overflow-hidden font-medium">
                  Submit
                </span>
              </Button>
            </div>
          </div>

          <div className="flex items-center mt-8 sm:mt-5 justify-between w-full">
            <div className="flex flex-col items-left justify-center rounded-lg space-y-2">
              <div className="text-white rounded-lg shadow-md">
                Set Buy B Ratio :
              </div>
              <Input
                placeholder="Enter Amount"
                className="bg-gray-900 text-white rounded-lg"
                onChange={(e) => setBuyBRatioVar(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg">
              <Button
                variant="outline"
                className="tech_btn cnctwlthedBtn flex items-center border-none rounded-full h-12 outline-none relative w-40 active:translate-y-1 active:scale-90 duration-150 ease-linear"
                onClick={handleSetBuyBRatio}
              >
                <i></i>
                <i></i>
                <span className="items-center bg-[#000000a6] rounded-full flex justify-center left-0 capitalize overflow-hidden font-medium">
                  Submit
                </span>
              </Button>
            </div>
          </div>

          <div className="flex items-center mt-8 sm:mt-5 justify-between w-full">
            <div className="flex flex-col items-left justify-center rounded-lg space-y-2">
              <div className="text-white rounded-lg shadow-md">
                Set Sell A Ratio :
              </div>
              <Input
                placeholder="Enter Amount"
                className="bg-gray-900 text-white rounded-lg"
                onChange={(e) => setSellARatioVar(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg">
              <Button
                variant="outline"
                className="tech_btn cnctwlthedBtn flex items-center border-none rounded-full h-12 outline-none relative w-40 active:translate-y-1 active:scale-90 duration-150 ease-linear"
                onClick={handleSetSellARatio}
              >
                <i></i>
                <i></i>
                <span className="items-center bg-[#000000a6] rounded-full flex justify-center left-0 capitalize overflow-hidden font-medium">
                  Submit
                </span>
              </Button>
            </div>
          </div>

          <div className="flex items-center mt-8 sm:mt-5 justify-between w-full">
            <div className="flex flex-col items-left justify-center rounded-lg space-y-2">
              <div className="text-white rounded-lg shadow-md">
                Set Sell B Ratio :
              </div>
              <Input
                placeholder="Enter Amount"
                className="bg-gray-900 text-white rounded-lg"
                onChange={(e) => setSellBRatioVar(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg">
              <Button
                variant="outline"
                className="tech_btn cnctwlthedBtn flex items-center border-none rounded-full h-12 outline-none relative w-40 active:translate-y-1 active:scale-90 duration-150 ease-linear"
                onClick={handleSetSellBRatio}
              >
                <i></i>
                <i></i>
                <span className="items-center bg-[#000000a6] rounded-full flex justify-center left-0 capitalize overflow-hidden font-medium">
                  Submit
                </span>
              </Button>
            </div>
          </div>

          <div className="flex items-center mt-8 sm:mt-5 justify-between w-full">
            <div className="flex flex-col items-left justify-center rounded-lg space-y-2">
              <div className="text-white rounded-lg shadow-md">
                Set Fee Percentage : (min : 0.001%) , (current :{" "}
                {feePercentageVar}%)
              </div>
              <Input
                placeholder="Enter fee percentage"
                className={`bg-gray-900 text-white rounded-lg ${
                  errorLogs ? "border-red-500" : "border-gray-700"
                }`}
                value={feePercentageVar}
                onChange={handleInputChange}
              />
              {errorLogs && <p className="text-red-500">{errorLogs}</p>}
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg">
              <Button
                variant="outline"
                className="tech_btn cnctwlthedBtn flex items-center border-none rounded-full h-12 outline-none relative w-40 active:translate-y-1 active:scale-90 duration-150 ease-linear"
                onClick={handleSetFeePercentage}
                disabled={!!errorLogs} // Disable the button if there's an error
              >
                <i></i>
                <i></i>
                <span className="items-center bg-[#000000a6] rounded-full flex justify-center left-0 capitalize overflow-hidden font-medium">
                  Submit
                </span>
              </Button>
            </div>
          </div>

          <div className="flex items-center mt-8 sm:mt-5 justify-between w-full">
            <div className="flex flex-col items-left justify-center rounded-lg space-y-2">
              <div className="text-white rounded-lg shadow-md">
                Set Fee Address :
              </div>
              <Input
                placeholder="Enter fee recipient address"
                className="bg-gray-900 text-white rounded-lg"
                onChange={(e) => setFeeAddressVar(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg">
              <Button
                variant="outline"
                className="tech_btn cnctwlthedBtn flex items-center border-none rounded-full h-12 outline-none relative w-40 active:translate-y-1 active:scale-90 duration-150 ease-linear"
                onClick={handleSetFeeAddress}
              >
                <i></i>
                <i></i>
                <span className="items-center bg-[#000000a6] rounded-full flex justify-center left-0 capitalize overflow-hidden font-medium">
                  Submit
                </span>
              </Button>
            </div>
          </div>

          <div className="flex items-center mt-8 sm:mt-5 justify-between w-full">
            <div className="flex flex-col items-left justify-center rounded-lg space-y-2">
              <div className="text-white rounded-lg shadow-md">
                Set Sell Rate of A as Default :
              </div>
              <div className="text-sm text-gray-400">
                Current A to B Swap Rate : {sellARatioAsDefaultVar}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg">
              <Button
                variant="outline"
                className="tech_btn cnctwlthedBtn flex items-center border-none rounded-full h-12 outline-none relative w-40 active:translate-y-1 active:scale-90 duration-150 ease-linear"
                onClick={handleSetSellARatioAsDefault}
              >
                <i></i>
                <i></i>
                <span className="items-center bg-[#000000a6] rounded-full flex justify-center left-0 capitalize overflow-hidden font-medium">
                  Submit
                </span>
              </Button>
            </div>
          </div>

          <div className="flex items-center mt-8 sm:mt-5 justify-between w-full">
            <div className="flex flex-col items-left justify-center rounded-lg space-y-2">
              <div className="text-white rounded-lg shadow-md">
                Set Sell Rate of B as Default :
              </div>
              <div className="text-sm text-gray-400">
                Current B to A Swap Rate: {sellBRatioAsDefaultVar}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg">
              <Button
                variant="outline"
                className="tech_btn cnctwlthedBtn flex items-center border-none rounded-full h-12 outline-none relative w-40 active:translate-y-1 active:scale-90 duration-150 ease-linear"
                onClick={handleSetSellBRatioAsDefault}
              >
                <i></i>
                <i></i>
                <span className="items-center bg-[#000000a6] rounded-full flex justify-center left-0 capitalize overflow-hidden font-medium">
                  Submit
                </span>
              </Button>
            </div>
          </div>

          <div className="flex items-center mt-8 sm:mt-5 justify-between w-full">
            <div className="flex flex-col items-left justify-center rounded-lg space-y-2">
              <div className="text-white rounded-lg shadow-md">
                Set A to B Swap Rate as Default :
              </div>
              <div className="text-sm text-gray-400">
                Current A to B Swap Rate : {atoBSwapRatioAsDefaultVar}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg">
              <Button
                variant="outline"
                className="tech_btn cnctwlthedBtn flex items-center border-none rounded-full h-12 outline-none relative w-40 active:translate-y-1 active:scale-90 duration-150 ease-linear"
                onClick={handleSetAtoBSwapRatioAsDefault}
              >
                <i></i>
                <i></i>
                <span className="items-center bg-[#000000a6] rounded-full flex justify-center left-0 capitalize overflow-hidden font-medium">
                  Submit
                </span>
              </Button>
            </div>
          </div>

          <div className="flex items-center mt-8 sm:mt-5 justify-between w-full">
            <div className="flex flex-col items-left justify-center rounded-lg space-y-2">
              <div className="text-white rounded-lg shadow-md">
                Set B to A Swap Rate as Default :
              </div>
              <div className="text-sm text-gray-400">
                Current B to A Swap Rate: {btoASwapRatioAsDefaultVar}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg">
              <Button
                variant="outline"
                className="tech_btn cnctwlthedBtn flex items-center border-none rounded-full h-12 outline-none relative w-40 active:translate-y-1 active:scale-90 duration-150 ease-linear"
                onClick={handleSetBtoASwapRatioAsDefault}
              >
                <i></i>
                <i></i>
                <span className="items-center bg-[#000000a6] rounded-full flex justify-center left-0 capitalize overflow-hidden font-medium">
                  Submit
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
