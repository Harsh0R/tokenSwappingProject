"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContractContext } from "@/Context/contractContect";
import React, { useContext } from "react";

const Page = () => {
  const { setMaxSwapAmountForTokenAFunc, setMaxSwapAmountForTokenBFunc } =
    useContext(ContractContext);

  const handleSetTokenASwapAmount = () => {
    setMaxSwapAmountForTokenAFunc((100).toString());
  };

  const handleSetTokenBSwapAmount = () => {
    setMaxSwapAmountForTokenBFunc((100).toString());
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      <h1 className="w-full text-xl font-bold mb-4">Admin Page</h1>

      <div className="flex max-w-2xl w-full relative mx-auto items-rounded-lg mt-6 gap-20 border-2 border-[#33333362] bg-[#10050588] cardbox before:h-full before:-left-[2px] before:absolute before:top-0 before:w-[2px] before:z-[2] after:h-full after:absolute after:-right-[2px] after:top-0 after:w-[2px] after:z-[2px] rounded-md cardbox">
        <div className="bg-box h-full left-0 opacity-40 absolute top-0 w-full -z-10"></div>
        <div className=" flex w-full justify-between  items-center px-3 sm:px-5 py-4 rounded-md relative ">
          <div className="flex items-center mt-8 sm:mt-5 justify-between w-full">
            <div className="flex flex-col items-center justify-center rounded-lg space-y-2">
              <div className="text-white rounded-lg shadow-md">
                Set Max Swap Amount for Token A
              </div>
              <Input
                placeholder="Enter Amount"
                className="bg-gray-900 text-white rounded-lg"
                onChange={(e) => setMaxSwapAmountForTokenAFunc(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg">
              <Button
                variant="outline"
                className="tech_btn cnctwlthedBtn flex items-center border-none rounded-full h-12 outline-none relative w-40 active:translate-y-1 active:scale-90 duration-150 ease-linear"
                onClick={handleSetTokenASwapAmount}
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
