'use client';
import { createContext, useEffect, useState } from "react";
import { connectContract, connectWallet, toWei, MATIC_DECIMAL, A_DECIMAL, B_DECIMAL, toTokenA, toTokenB, getTokenContract, toEth, toEthA, toEthB } from "../Utils/utilsFunctions";
import { ethers } from "ethers";
import { contractAddress } from "@/Constants/Constants";


export const ContractContext = createContext();

const ContractContextProvider = ({ children }) => {

  const [contract, setContract] = useState();
  const [account, setAccount] = useState();
  const [transactionStatus, setTransactionStatus] = useState("");

  useEffect(() => {
    console.log("Calling connectContract");
    const contract = connectContract();
    setContract(contract);

    connectToWallet();

  }, [])


  const connectToWallet = async () => {
    try {
      const account = await connectWallet();
      setAccount(account);
      return account;
    } catch (error) {
      console.log("error in connectWallet => ", error);
    }
  };

  const hasValideAllowance = async (address, type) => {
    try {
      const contractObj = await connectContract();
      // const address = await contractObj.tokenA();
      // console.log("Token Address === ", address);
      const tokenContractObj = await getTokenContract(address);
      const data = await tokenContractObj.allowance(
        account,
        contractAddress
      );
      if (type === 'tokenA') {
        const result = toEthA(data);
        console.log("allowance === ", result);
        return result;
      } else if (type === 'tokenB') {
        const result = toEthB(data);
        console.log("allowance === ", result);
        return result;

      }
    } catch (e) {
      return console.error("Error in hasAllowes == ", e);
    }
  }
  const increaseAllowance = async (amount, tokenType) => {
    try {
      // console.log("Amount = ", amount);
      console.log("Token Type = ", tokenType);


      const contractObj = await connectContract();
      let address;
      if (tokenType === "TokenA") {
        console.log("Amount in tokenA = ", toTokenA(amount));
        address = await contractObj.tokenA();
        const tokenContractObj = await getTokenContract(address);
        const data = await tokenContractObj.approve(
          contractAddress,
          toTokenA(amount)
        );
        console.log("DAta = ", data);
      } else if (tokenType === "TokenB") {
        console.log("Amount in tokenB = ", toTokenB(amount));
        address = await contractObj.tokenB();
        const tokenContractObj = await getTokenContract(address);
        const data = await tokenContractObj.approve(
          contractAddress,
          toTokenB(amount)
        );
        console.log("DAta = ", data);
      } else {
        console.log("Not valid token type");
      }
      console.log("Token Type = ", address);
    } catch (e) {
      return console.log("Error at Increase allowence = ", e);
    }
  }

  // region Getter Functions

  const getTokenAAmount = async (account) => {
    try {
      const contract = await connectContract();
      console.log("tokenAAmount address => ", account);
      const tokenAAmount = await contract.tokenBalanceA(account);
      const result = ethers.utils.formatEther(tokenAAmount) * MATIC_DECIMAL / A_DECIMAL;
      console.log("tokenAAmount => ", result);
      return result;
    } catch (error) {
      console.log("error in getTokenAAmount function => ", error);
    }
  }

  const getTokenBAmount = async (account) => {
    try {
      const contract = await connectContract();
      const tokenBAmount = await contract.tokenBalanceB(account);
      const result = ethers.utils.formatEther(tokenBAmount) * MATIC_DECIMAL / B_DECIMAL;
      console.log("tokenBAmount => ", result);
      return result;
    } catch (error) {
      console.log("error in getTokenBAmount function => ", error);
    }
  }

  const getFeePercentage = async () => {
    try {
      const contract = await connectContract();
      const feePercentage = await contract.feePercentage();
      const result = ethers.BigNumber.from(feePercentage).toNumber();
      console.log("feePercentage => ", result);
      return feePercentage / 1000;
    } catch (error) {
      console.log("error in getFeePercentage function => ", error);
    }
  }

  const getMaxSwapAmountForA = async () => {
    try {
      const contract = await connectContract();
      const amount = await contract.maxSwapAmountForA();
      const result = toEthA(amount);
      console.log("maxSwapAmountForA => ", result);
      return result;
    } catch (error) {
      console.log("error in getMaxSwapAmountForA function => ", error);
    }
  }

  const getMaxSwapAmountForB = async () => {
    try {
      const contract = await connectContract();
      const amount = await contract.maxSwapAmountForB();
      const result = toEthB(amount);
      console.log("maxSwapAmountForB => ", result);
      return result;
    } catch (error) {
      console.log("error in getMaxSwapAmountForB function => ", error);
    }
  }

  const getFeeAddress = async () => {
    try {
      const contract = await connectContract();
      const feeAddress = await contract.feeAddress();
      const result = feeAddress;
      console.log("feeAddress => ", result);
      return result;
    } catch (error) {
      console.log("error in getFeeAddress function => ", error);
    }
  }

  const getBuyARatio = async () => {
    try {
      const contract = await connectContract();
      const buyARatio = await contract.buyARatio();
      const result = ethers.utils.formatEther(buyARatio);
      console.log("buyARatio => ", buyARatio);

      return result * MATIC_DECIMAL / A_DECIMAL;
    } catch (error) {
      console.log("error in getBuyARatio function => ", error);
    }
  }

  const getBuyBRatio = async () => {
    try {
      const contract = await connectContract();
      const buyBRatio = await contract.buyBRatio();
      const result = ethers.utils.formatEther(buyBRatio);
      console.log("buyBRatio => ", result);
      return result * MATIC_DECIMAL / B_DECIMAL;
    } catch (error) {
      console.log("error in getBuyBRatio function => ", error);
    }
  }

  const getSellARatio = async () => {
    try {
      const contract = await connectContract();
      const sellARatio = await contract.sellARatio();
      const result = ethers.utils.formatEther(sellARatio);
      console.log("sellARatio => ", result);
      return result * MATIC_DECIMAL / A_DECIMAL;
    } catch (error) {
      console.log("error in getSellARatio function => ", error);
    }
  }

  const getSellBRatio = async () => {
    try {
      const contract = await connectContract();
      const sellBRatio = await contract.sellBRatio();
      const result = ethers.utils.formatEther(sellBRatio);
      console.log("sellBRatio => ", result);
      return result * MATIC_DECIMAL / B_DECIMAL;
    } catch (error) {
      console.log("error in getSellBRatio function => ", error);
    }
  }

  const getAtoBSwapRatio = async () => {
    try {
      const contract = await connectContract();
      const atoBSwapRatio = await contract.AtoBSwapRatio();
      const result = ethers.utils.formatEther(atoBSwapRatio);
      console.log("atoBSwapRatio => ", result * A_DECIMAL / B_DECIMAL);
      return result * A_DECIMAL / B_DECIMAL;
    } catch (error) {
      console.log("error in getAtoBSwapRatio function => ", error);
    }
  }
  const getBtoASwapRatio = async () => {
    try {
      const contract = await connectContract();
      const btoASwapRatio = await contract.BtoASwapRatio();
      const result = ethers.utils.formatEther(btoASwapRatio);
      console.log("btoASwapRatio => ", result * A_DECIMAL);
      return result * A_DECIMAL;
    } catch (error) {
      console.log("error in getBtoASwapRatio function => ", error);
    }
  }

  const getTokenAAddress = async () => {
    try {
      const contract = await connectContract();

      console.log("Calling connectContract in getTokenAAddress", contract);
      const tokenAddress = await contract.tokenA();
      console.log("tokenAddress in getTokenAAddress => ", tokenAddress);
      return tokenAddress;
    } catch (error) {
      console.log("error in getTokenAAddress function => ", error);
    }
  }

  const getTokenBAddress = async () => {
    try {
      const contract = await connectContract();
      console.log("Calling connectContract in getTokenBAddress", contract);
      const tokenAddress = await contract.tokenB();
      console.log("tokenAddress => ", tokenAddress);
      return tokenAddress;
    } catch (error) {
      console.log("error in getTokenBAddress function => ", error);
    }
  }


  //region Transaction Functions

  const buyTokenA = async (amountMatic) => {
    try {
      console.log("Called buyTokenA => ", amountMatic);

      const contract = await connectContract();
      const amountInWei = toWei(amountMatic);
      console.log("amountInWei => ", amountInWei);

      const tx = await contract.buyTokenA({
        value: amountInWei,
      });
      await tx.wait();
      setTransactionStatus(`TokenA purchase successful!`);
    } catch (error) {
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }
  const buyTokenB = async (amountMatic) => {
    try {
      const contract = await connectContract();
      const amountInWei = toWei(amountMatic);
      const tx = await contract.buyTokenB({
        value: amountInWei,
      });
      await tx.wait();
      setTransactionStatus(`TokenB purchase successful!`);
    } catch (error) {
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }

  const sellTokenA = async (amountMatic) => {
    try {
      const contract = await connectContract();
      const amountInWei = toTokenA(amountMatic);
      console.log("amountInWei => ", amountInWei);

      const tx = await contract.swapAtoMatic(amountInWei);
      await tx.wait();
      setTransactionStatus(`TokenA purchase successful!`);
    } catch (error) {
      console.log("Error => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }
  const sellTokenB = async (amountMatic) => {
    try {
      const contract = await connectContract();
      const amountInWei = toTokenB(amountMatic);
      const tx = await contract.swapBtoMatic(amountInWei);
      await tx.wait();
      setTransactionStatus(`TokenB purchase successful!`);
    } catch (error) {
      console.log("Error => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }

  const swapTokenAToTokenB = async (amountMatic) => {
    try {
      const contract = await connectContract();
      const amountInWei = toTokenA(amountMatic);
      const tx = await contract.swapAtoB(amountInWei);
      await tx.wait();
      setTransactionStatus(`TokenB purchase successful!`);
    } catch (error) {
      console.log("Error => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }

  const swapTokenBToTokenA = async (amountMatic) => {
    try {
      const contract = await connectContract();
      const amountInWei = toTokenB(amountMatic);
      const tx = await contract.swapBtoA(amountInWei);
      await tx.wait();
      setTransactionStatus(`TokenB purchase successful!`);
    } catch (error) {
      console.log("Error => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }





  // region Setter Functions

  const setMaxSwapAmountForTokenAFunc = async (amount) => {

    try {

      const contract = await connectContract();
      const amountInWei = toTokenA(amount);
      const tx = await contract.setMaxSwapAmountForA(amountInWei);
      await tx.wait();
      setTransactionStatus(`Max swap amount for tokenA set successful!`);

    } catch (error) {
      console.log("Error in setMaxSwapAmountForTokenAFunc => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }

  const setMaxSwapAmountForTokenBFunc = async (amount) => {

    try {

      const contract = await connectContract();
      const amountInWei = toTokenB(amount);
      const tx = await contract.setMaxSwapAmountForB(amountInWei);
      await tx.wait();
      setTransactionStatus(`Max swap amount for tokenB set successful!`);

    }
    catch (error) {
      console.log("Error in setMaxSwapAmountForTokenBFunc => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }

  const setBuyARatio = async (ratio) => {
    try {
      const contract = await connectContract();
      const ratioInWei = toTokenA(ratio);
      const tx = await contract.setBuyARatio(ratioInWei);
      await tx.wait();
      setTransactionStatus(`BuyA ratio set successful!`);

    } catch (error) {
      console.log("Error in setBuyARatio => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }

  const setBuyBRatio = async (ratio) => {
    try {
      const contract = await connectContract();
      const ratioInWei = toTokenB(ratio);
      const tx = await contract.setBuyBRatio(ratioInWei);
      await tx.wait();
      setTransactionStatus(`BuyB ratio set successful!`);
    } catch (error) {
      console.log("Error in setBuyBRatio => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }

  const setAtoBSwapRatio = async (ratio) => {
    try {
      const contract = await connectContract();
      const ratioInWei = toTokenA(ratio);
      const tx = await contract.setAtoBSwapRatio(ratioInWei);
      await tx.wait();
      setTransactionStatus(`AtoB Swap ratio set successful!`);
    } catch (error) {
      console.log("Error in setAtoBSwapRatio => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }

  const setBtoASwapRatio = async (ratio) => {
    try {
      const contract = await connectContract();
      const ratioInWei = toTokenB(ratio);
      const tx = await contract.setBtoASwapRatio(ratioInWei);
      await tx.wait();
      setTransactionStatus(`BtoA Swap ratio set successful!`);
    } catch (error) {
      console.log("Error in setBtoASwapRatio => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }

  const setSellARatio = async (ratio) => {
    try {
      const contract = await connectContract();
      const ratioInWei = toTokenA(ratio);
      const tx = await contract.setSellARatio(ratioInWei);
      await tx.wait();
      setTransactionStatus(`SellA ratio set successful!`);
    } catch (error) {
      console.log("Error in setSellARatio => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }
  const setSellBRatio = async (ratio) => {
    try {
      const contract = await connectContract();
      const ratioInWei = toTokenB(ratio);
      const tx = await contract.setSellBRatio(ratioInWei);
      await tx.wait();
      setTransactionStatus(`SellB ratio set successful!`);
    } catch (error) {
      console.log("Error in setSellBRatio => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }

  const setAtoBSwapRatioAsDefault = async (ratio) => {
    try {
      const contract = await connectContract();
      const tx = await contract.setAtoBSwapRatioAsDefault();
      await tx.wait();
      setTransactionStatus(`AtoB Swap ratio set as default successful!`);
    } catch (error) {
      console.log("Error in setAtoBSwapRatioAsDefault => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }

  const setBtoASwapRatioAsDefault = async (ratio) => {
    try {
      const contract = await connectContract();
      const tx = await contract.setBtoASwapRatioAsDefault();
      await tx.wait();
      setTransactionStatus(`BtoA Swap ratio set as default successful!`);
    } catch (error) {
      console.log("Error in setBtoASwapRatioAsDefault => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }

  const setSellARatioAsDefault = async () => {
    try {
      const contract = await connectContract();
      const tx = await contract.setSellARatioAsDefault();
      await tx.wait();
      setTransactionStatus(`SellA ratio set as default successful!`);
    } catch (error) {
      console.log("Error in setSellARatioAsDefault => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }
  const setSellBRatioAsDefault = async () => {
    try {
      const contract = await connectContract();
      const tx = await contract.setSellBRatioAsDefault();
      await tx.wait();
      setTransactionStatus(`SellB ratio set as default successful!`);
    } catch (error) {
      console.log("Error in setSellBRatioAsDefault => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }

  const setFeePercentage = async (ratio) => {
    try {
      const contract = await connectContract();
      const ratioInWei = ratio * 1000;
      const tx = await contract.setFeePercentage(ratioInWei);
      await tx.wait();
      setTransactionStatus(`Fee percentage set successful!`);
    } catch (error) {
      console.log("Error in setFeePercentage => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }

  const setFeeAddress = async (address) => {
    try {
      const contract = await connectContract();
      // const addressInWei = toWei(address);
      const tx = await contract.setFeeAddress(address);
      await tx.wait();
      setTransactionStatus(`Fee address set successful!`);
    } catch (error) {
      console.log("Error in setFeeAddress => ", error);
      setTransactionStatus(`Transaction failed: ${error.message}`);
    }
  }



  return (
    <ContractContext.Provider value={{ contract, getTokenAAddress, getTokenBAddress, connectToWallet, account, getBuyARatio, getBuyBRatio, buyTokenA, buyTokenB, transactionStatus, setTransactionStatus, getTokenAAmount, getTokenBAmount, getFeePercentage, getSellARatio, getSellBRatio, sellTokenA, sellTokenB, hasValideAllowance, increaseAllowance, getAtoBSwapRatio, getBtoASwapRatio, swapTokenAToTokenB, swapTokenBToTokenA, setMaxSwapAmountForTokenAFunc, setMaxSwapAmountForTokenBFunc, setBuyARatio, setBuyBRatio, setAtoBSwapRatio, setBtoASwapRatio, setSellARatio, setSellBRatio, setAtoBSwapRatioAsDefault, setBtoASwapRatioAsDefault, setSellARatioAsDefault, setSellBRatioAsDefault, setFeePercentage, setFeeAddress, getMaxSwapAmountForA, getMaxSwapAmountForB, getFeeAddress }}>
      {children}
    </ContractContext.Provider>
  )
}

export default ContractContextProvider;