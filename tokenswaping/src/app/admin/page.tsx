"use client";
import { Button } from "@/components/ui/button";
import { ContractContext } from "@/Context/contractContect";
import React, { useContext } from "react";

const page = () => {
  const { setMaxSwapAmountForTokenAFunc, setMaxSwapAmountForTokenBFunc } =
    useContext(ContractContext);

  const handleSetTokenASwapAmount = () => {
    setMaxSwapAmountForTokenAFunc((100).toString());
  };

  const handleSetTokenBSwapAmount = () => {
    setMaxSwapAmountForTokenBFunc((100).toString());
  };

  return (
    <div>
      Admin page
      <Button
        variant="outline"
        className="w-full mt-2"
        onClick={handleSetTokenASwapAmount}
      >
        Set Max Swap Amount for TokenA
      </Button>
      <Button
        variant="outline"
        className="w-full mt-2"
        onClick={handleSetTokenBSwapAmount}
      >
        Set Max Swap Amount for TokenB
      </Button>
    </div>
  );
};

export default page;
