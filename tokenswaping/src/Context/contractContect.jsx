'use client';
import { createContext, useEffect, useState } from "react";
import { connectContract, connectWallet, toWei , MATIC_DECIMAL , A_DECIMAL , B_DECIMAL, toTokenA, toTokenB, getTokenContract } from "../Utils/utilsFunctions";
import { ethers } from "ethers";

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

  const hasValideAllowance = async (owner = account) => {
    try {
      const contractObj = await connectContract();
      const address = await contractObj.tokenA();
      console.log("Token Address === ", address);
      const tokenContractObj = await getTokenContract(address);
      const data = await tokenContractObj.allowance(
        owner,
        smartContractAddress
      );
      const result = toEth(data);
      console.log("allowance === ", result);
      return result;
    } catch (e) {
      return console.error("Error in hasAllowes == ", e);
    }
  }
  const increaseAllowance = async (amount , tokenType) => {
    try {
      // console.log("Amount = ", amount);
      console.log("Token Type = ", tokenType);
      
      
      const contractObj = await connectContract();
      let address;
      if (tokenType === "TokenA") {
        console.log("Amount = ", toTokenA(amount));
        address = await contractObj.tokenA(); 
        const tokenContractObj = await getTokenContract(address);
        const data = await tokenContractObj.approve(
          account,
          toTokenA(amount)
        );
        console.log("DAta = ", data);
      }else{
        console.log("Amount = ", toTokenB(amount));
        address = await contractObj.tokenB();
        const tokenContractObj = await getTokenContract(address);
        const data = await tokenContractObj.approve(
          account,
          toTokenB(amount)
        );
        console.log("DAta = ", data);
      }
      console.log("Token Type = ", address);
    } catch (e) {
      return console.log("Error at Increase allowence = ", e);
    }
  }



  const getBuyARatio = async () => {
    try {
      const contract = await connectContract();
      const buyARatio = await contract.buyARatio();
      const result = ethers.utils.formatEther(buyARatio);
      console.log("buyARatio => ", buyARatio);

      return result;
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
      return result;
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
      return result;
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
      return result;
    } catch (error) {
      console.log("error in getSellBRatio function => ", error);
    }
  }

  const buyTokenA = async (amountMatic) => {
    try {
      const contract = await connectContract();
      const amountInWei = toWei(amountMatic);
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

  const getFeePercentage = async () => {
    try {
      const contract = await connectContract();
      const feePercentage = await contract.feePercentage();
      const result = ethers.utils.formatEther(feePercentage);
      console.log("feePercentage => ", result);
      return feePercentage;
    } catch (error) {
      console.log("error in getFeePercentage function => ", error);
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

  return (
    <ContractContext.Provider value={{ contract, getTokenAAddress, getTokenBAddress, connectToWallet, account, getBuyARatio, getBuyBRatio, buyTokenA, buyTokenB, transactionStatus, setTransactionStatus, getTokenAAmount, getTokenBAmount , getFeePercentage , getSellARatio , getSellBRatio , sellTokenA , sellTokenB , hasValideAllowance , increaseAllowance }}>
      {children}
    </ContractContext.Provider>
  )
}

export default ContractContextProvider;