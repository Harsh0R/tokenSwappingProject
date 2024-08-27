'use client';
import { createContext, useEffect, useState } from "react";
import { connectContract, connectWallet } from "../Utils/utilsFunctions";

export const ContractContext = createContext();

const ContractContextProvider = ({ children }) => {

  const [contract, setContract] = useState();
  const [account, setAccount] = useState();

  useEffect(() => {
    console.log("Calling connectContract");
    const contract = connectContract();
    setContract(contract);
    
    connectToWallet();

  }, [])



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

  const connectToWallet = async () => {
    try {
      const account = await connectWallet();
      setAccount(account);
    } catch (error) {
      console.log("error in connectWallet => ", error);
    }
  };


  return (
    <ContractContext.Provider value={{ contract, getTokenAAddress, getTokenBAddress, connectToWallet, account }}>
      {children}
    </ContractContext.Provider>
  )
}

export default ContractContextProvider;