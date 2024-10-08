"use client";
import { createContext, useEffect, useState } from "react";
import {
  connectContract,
  connectWallet,
  toWei,
  MATIC_DECIMAL,
  A_DECIMAL,
  B_DECIMAL,
  toTokenA,
  toTokenB,
  getTokenContract,
  toEth,
  toEthA,
  toEthB,
  getStakingContract,
  getMyCustomTokenContract,
} from "../Utils/utilsFunctions";
import { BigNumber, ethers } from "ethers";
import {
  StakingContractAddress,
  SwappingContractAddress,
} from "@/Constants/Constants";
import { createClient } from "urql";

export const ContractContext = createContext<any>(undefined);

const ContractContextProvider = ({ children }: any) => {
  const [contract, setContract] = useState<any>();
  const [account, setAccount] = useState();
  const [transactionStatus, setTransactionStatus] = useState("");

  useEffect(() => {
    const contract = connectContract();
    setContract(contract);

    connectToWallet();
  }, []);

  const connectToWallet = async () => {
    try {
      const account = await connectWallet();
      setAccount(account);
      return account;
    } catch (error) {
      console.log("error in connectWallet => ", error);
    }
  };

  // region Swapping Contract Functions
  const hasValideAllowanceForStakingToken = async (
    address: string,
    decimal: number
  ) => {
    try {
      const tokenContractObj = await getTokenContract(address);
      const data = await tokenContractObj?.allowance(
        account,
        StakingContractAddress
      );
      let result;
      if (decimal == 18) {
        result = toEth(data);
      } else if (decimal == 12) {
        result = toEthA(data);
      } else if (decimal == 6) {
        result = toEthB(data);
      }
      return result;
    } catch (e) {
      return console.error("Error in hasAllowes == ", e);
    }
  };
  const hasValideAllowance = async (address: string, type: string) => {
    try {
      const tokenContractObj = await getTokenContract(address);
      const data = await tokenContractObj?.allowance(
        account,
        SwappingContractAddress
      );
      if (type === "tokenA") {
        const result = toEthA(data);
        return result;
      } else if (type === "tokenB") {
        const result = toEthB(data);
        return result;
      }
    } catch (e) {
      return console.error("Error in hasAllowes == ", e);
    }
  };

  const increaseAllowance = async (amount: number, tokenType: string) => {
    try {
      const contractObj = await connectContract();
      let address;
      if (tokenType === "TokenA") {
        address = await contractObj?.tokenA();
        const tokenContractObj = await getTokenContract(address);
        const data = await tokenContractObj?.approve(
          SwappingContractAddress,
          toTokenA(amount.toString())
        );
      } else if (tokenType === "TokenB") {
        address = await contractObj?.tokenB();
        const tokenContractObj = await getTokenContract(address);
        const data = await tokenContractObj?.approve(
          SwappingContractAddress,
          toTokenB(amount.toString())
        );
      } else {
        console.log("Not valid token type");
      }
    } catch (e) {
      return console.log("Error at Increase allowence = ", e);
    }
  };

  const increaseAllowanceForStakingToken = async (
    address: string,
    amount: number,
    decimal: number
  ) => {
    try {
      const tokenContractObj = await getMyCustomTokenContract(address);
      if (decimal == 18) {
        const data = await tokenContractObj?.approve(
          StakingContractAddress,
          toWei(amount.toString())
        );
      } else if (decimal == 12) {
        const data = await tokenContractObj?.approve(
          StakingContractAddress,
          toTokenA(amount.toString())
        );
      } else if (decimal == 6) {
        const data = await tokenContractObj?.approve(
          StakingContractAddress,
          toTokenB(amount.toString())
        );
      }
    } catch (e) {
      return console.log("Error at Increase allowence = ", e);
    }
  };

  // region Getter Functions

  const getTokenAAmount = async (account: string) => {
    try {
      const contract = await connectContract();
      const tokenAAmount = await contract?.tokenBalanceA(account);
      if (!tokenAAmount) {
        throw new Error("Token A balance is undefined");
      }
      const formattedTokenAAmount = ethers.utils.formatEther(tokenAAmount);
      const result =
        (parseFloat(formattedTokenAAmount) * MATIC_DECIMAL) / A_DECIMAL;
      return result;
    } catch (error) {
      console.log("Error in getTokenAAmount function => ", error);
    }
  };

  const getTokenBAmount = async (account: string) => {
    try {
      const contract = await connectContract();
      const tokenBAmount = await contract?.tokenBalanceB(account);
      if (!tokenBAmount) {
        throw new Error("Token B balance is undefined");
      }
      const formattedTokenBAmount = ethers.utils.formatEther(tokenBAmount);
      const result =
        (parseFloat(formattedTokenBAmount) * MATIC_DECIMAL) / B_DECIMAL;
      return result;
    } catch (error) {
      console.log("Error in getTokenBAmount function =>", error);
    }
  };

  const getFeePercentage = async () => {
    try {
      const contract = await connectContract();
      const feePercentage = await contract?.feePercentage();
      return feePercentage / 1000;
    } catch (error) {
      console.log("error in getFeePercentage function => ", error);
    }
  };

  const getMaxSwapAmountForA = async () => {
    try {
      const contract = await connectContract();
      const amount = await contract?.maxSwapAmountForA();
      const result = toEthA(amount);
      return result;
    } catch (error) {
      console.log("error in getMaxSwapAmountForA function => ", error);
    }
  };

  const getMaxSwapAmountForB = async () => {
    try {
      const contract = await connectContract();
      const amount = await contract?.maxSwapAmountForB();
      const result = toEthB(amount);
      return result;
    } catch (error) {
      console.log("error in getMaxSwapAmountForB function => ", error);
    }
  };

  const getFeeAddress = async () => {
    try {
      const contract = await connectContract();
      const feeAddress = await contract?.feeAddress();
      const result = feeAddress;
      return result;
    } catch (error) {
      console.log("error in getFeeAddress function => ", error);
    }
  };

  const getBuyARatio = async () => {
    try {
      const contract = await connectContract();
      const buyARatio = await contract?.buyARatio();
      const formattedRatio = ethers.utils.formatEther(buyARatio);
      const result = (parseFloat(formattedRatio) * MATIC_DECIMAL) / A_DECIMAL;
      return result;
    } catch (error) {
      console.log("Error in getBuyARatio function =>", error);
    }
  };

  const getBuyBRatio = async () => {
    try {
      const contract = await connectContract();
      const buyBRatio = await contract?.buyBRatio();
      const formattedRatio = ethers.utils.formatEther(buyBRatio);
      const result = (parseFloat(formattedRatio) * MATIC_DECIMAL) / B_DECIMAL;
      return result;
    } catch (error) {
      console.log("Error in getBuyBRatio function =>", error);
    }
  };

  const getSellARatio = async () => {
    try {
      const contract = await connectContract();
      const sellARatio = await contract?.sellARatio();
      const formattedRatio = ethers.utils.formatEther(sellARatio);
      const result = (parseFloat(formattedRatio) * MATIC_DECIMAL) / A_DECIMAL;
      return result;
    } catch (error) {
      console.log("Error in getSellARatio function =>", error);
    }
  };

  const getSellBRatio = async () => {
    try {
      const contract = await connectContract();
      const sellBRatio = await contract?.sellBRatio();
      const formattedRatio = ethers.utils.formatEther(sellBRatio);
      const result = (parseFloat(formattedRatio) * MATIC_DECIMAL) / B_DECIMAL;
      return result;
    } catch (error) {
      console.log("Error in getSellBRatio function =>", error);
    }
  };

  const getAtoBSwapRatio = async () => {
    try {
      const contract = await connectContract();
      const atoBSwapRatio = await contract?.AtoBSwapRatio();
      const formattedRatio = ethers.utils.formatEther(atoBSwapRatio);
      const result = (parseFloat(formattedRatio) * A_DECIMAL) / B_DECIMAL;
      return result;
    } catch (error) {
      console.log("Error in getAtoBSwapRatio function =>", error);
    }
  };

  const getBtoASwapRatio = async () => {
    try {
      const contract = await connectContract();
      const btoASwapRatio = await contract?.BtoASwapRatio();
      const formattedRatio = ethers.utils.formatEther(btoASwapRatio);
      const result = parseFloat(formattedRatio) * A_DECIMAL;
      return result;
    } catch (error) {
      console.log("Error in getBtoASwapRatio function =>", error);
    }
  };

  const getTokenAAddress = async () => {
    try {
      const contract = await connectContract();
      const tokenAddress = await contract?.tokenA();
      return tokenAddress;
    } catch (error) {
      console.log("error in getTokenAAddress function => ", error);
    }
  };

  const getTokenBAddress = async () => {
    try {
      const contract = await connectContract();
      const tokenAddress = await contract?.tokenB();
      return tokenAddress;
    } catch (error) {
      console.log("error in getTokenBAddress function => ", error);
    }
  };

  //region Transaction Functions

  const buyTokenA = async (amountMatic: string | number) => {
    try {
      const contract = await connectContract();
      const amountInWei = toWei(amountMatic.toString()); // Convert Matic to Wei
      const tx = await contract?.buyTokenA({ value: amountInWei });
      await tx.wait();
      setTransactionStatus(`TokenA purchase successful!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
      console.error("Error in buyTokenA =>", error);
    }
  };

  const buyTokenB = async (amountMatic: string | number) => {
    try {
      const contract = await connectContract();
      const amountInWei = toWei(amountMatic.toString());
      const tx = await contract?.buyTokenB({ value: amountInWei });
      await tx.wait();
      setTransactionStatus(`TokenB purchase successful!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
      console.error("Error in buyTokenB =>", error);
    }
  };

  const sellTokenA = async (amountMatic: string | number) => {
    try {
      const contract = await connectContract();
      const amountInWei = toTokenA(amountMatic.toString()); // Convert Matic to TokenA units
      const tx = await contract?.swapAtoMatic(amountInWei);
      await tx.wait();
      setTransactionStatus(`TokenA sale successful!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
      console.error("Error in sellTokenA =>", error);
    }
  };

  const sellTokenB = async (amountMatic: string | number) => {
    try {
      const contract = await connectContract();
      const amountInWei = toTokenB(amountMatic.toString()); // Convert Matic to TokenB units
      const tx = await contract?.swapBtoMatic(amountInWei);
      await tx.wait();
      setTransactionStatus(`TokenB sale successful!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
      console.error("Error in sellTokenB =>", error);
    }
  };

  const swapTokenAToTokenB = async (amountMatic: string | number) => {
    try {
      const contract = await connectContract();
      const amountInWei = toTokenA(amountMatic.toString()); // Convert Matic to TokenA units
      const tx = await contract?.swapAtoB(amountInWei);
      await tx.wait();
      setTransactionStatus(`Token swap (A to B) successful!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
      console.error("Error in swapTokenAToTokenB =>", error);
    }
  };

  const swapTokenBToTokenA = async (amountMatic: string | number) => {
    try {
      const contract = await connectContract();
      const amountInWei = toTokenB(amountMatic.toString()); // Convert Matic to TokenB units
      const tx = await contract?.swapBtoA(amountInWei);
      await tx.wait();
      setTransactionStatus(`Token swap (B to A) successful!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
      console.error("Error in swapTokenBToTokenA =>", error);
    }
  };

  // region Setter Functions

  const setMaxSwapAmountForTokenAFunc = async (amount: string | number) => {
    try {
      const contract = await connectContract();
      const amountInWei = toTokenA(amount.toString());
      const tx = await contract?.setMaxSwapAmountForA(amountInWei);
      await tx.wait();
      setTransactionStatus(`Max swap amount for tokenA set successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setMaxSwapAmountForTokenAFunc => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const setMaxSwapAmountForTokenBFunc = async (amount: string | number) => {
    try {
      const contract = await connectContract();
      const amountInWei = toTokenB(amount.toString());
      const tx = await contract?.setMaxSwapAmountForB(amountInWei);
      await tx.wait();
      setTransactionStatus(`Max swap amount for tokenB set successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setMaxSwapAmountForTokenBFunc => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const setBuyARatio = async (ratio: string | number) => {
    try {
      const contract = await connectContract();
      const ratioInWei = toTokenA(ratio.toString());
      const tx = await contract?.setBuyARatio(ratioInWei);
      await tx.wait();
      setTransactionStatus(`BuyA ratio set successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setBuyARatio => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const setBuyBRatio = async (ratio: string | number) => {
    try {
      const contract = await connectContract();
      const ratioInWei = toTokenB(ratio.toString());
      const tx = await contract?.setBuyBRatio(ratioInWei);
      await tx.wait();
      setTransactionStatus(`BuyB ratio set successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setBuyBRatio => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const setAtoBSwapRatio = async (ratio: string | number) => {
    try {
      const contract = await connectContract();
      const ratioInWei = toTokenA(ratio.toString());
      const tx = await contract?.setAtoBSwapRatio(ratioInWei);
      await tx.wait();
      setTransactionStatus(`AtoB Swap ratio set successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setAtoBSwapRatio => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const setBtoASwapRatio = async (ratio: string | number) => {
    try {
      const contract = await connectContract();
      const ratioInWei = toTokenB(ratio.toString());
      const tx = await contract?.setBtoASwapRatio(ratioInWei);
      await tx.wait();
      setTransactionStatus(`BtoA Swap ratio set successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setBtoASwapRatio => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const setSellARatio = async (ratio: string | number) => {
    try {
      const contract = await connectContract();
      const ratioInWei = toTokenA(ratio.toString());
      const tx = await contract?.setSellARatio(ratioInWei);
      await tx.wait();
      setTransactionStatus(`SellA ratio set successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setSellARatio => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const setSellBRatio = async (ratio: string | number) => {
    try {
      const contract = await connectContract();
      const ratioInWei = toTokenB(ratio.toString());
      const tx = await contract?.setSellBRatio(ratioInWei);
      await tx.wait();
      setTransactionStatus(`SellB ratio set successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setSellBRatio => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const setAtoBSwapRatioAsDefault = async () => {
    try {
      const contract = await connectContract();
      const tx = await contract?.setAtoBSwapRatioAsDefault();
      await tx.wait();
      setTransactionStatus(`AtoB Swap ratio set as default successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setAtoBSwapRatioAsDefault => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const setBtoASwapRatioAsDefault = async () => {
    try {
      const contract = await connectContract();
      const tx = await contract?.setBtoASwapRatioAsDefault();
      await tx.wait();
      setTransactionStatus(`BtoA Swap ratio set as default successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setBtoASwapRatioAsDefault => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const setSellARatioAsDefault = async () => {
    try {
      const contract = await connectContract();
      const tx = await contract?.setSellARatioAsDefault();
      await tx.wait();
      setTransactionStatus(`SellA ratio set as default successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setSellARatioAsDefault => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const setSellBRatioAsDefault = async () => {
    try {
      const contract = await connectContract();
      const tx = await contract?.setSellBRatioAsDefault();
      await tx.wait();
      setTransactionStatus(`SellB ratio set as default successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setSellBRatioAsDefault => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const setFeePercentage = async (ratio: number) => {
    try {
      const contract = await connectContract();
      const ratioInWei = ratio * 1000;
      const tx = await contract?.setFeePercentage(ratioInWei);
      await tx.wait();
      setTransactionStatus(`Fee percentage set successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setFeePercentage => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const setFeeAddress = async (address: string) => {
    try {
      const contract = await connectContract();
      const tx = await contract?.setFeeAddress(address);
      await tx.wait();
      setTransactionStatus(`Fee address set successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setFeeAddress => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  // region Staking Contract Functions

  const createToken = async (
    name: string,
    symbol: string,
    initialSupply: number,
    decimal: number
  ) => {
    try {
      const contract = await getStakingContract();
      const tx = await contract?.createToken(
        name,
        symbol,
        initialSupply,
        decimal
      );
      await tx.wait();
      setTransactionStatus(`Token created successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in createToken => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const getAllTokens = async () => {
    try {
      const contract = await getStakingContract();
      const tokens = await contract?.getAllTokens();
      console.log("Tokens =>", tokens);

      return tokens;
    } catch (error) {
      console.log("Error in getAllTokens => ", error);
    }
  };

  const getTokenData = async (address: string) => {
    try {
      console.log("address =>", address);
      console.log("address =>", StakingContractAddress);
      const account = await connectWallet();
      console.log("address =>", account);
      const tokenContractObj = await getMyCustomTokenContract(address);
      const name = await tokenContractObj?.name();
      const symbol = await tokenContractObj?.symbol();
      const decimal = await tokenContractObj?.decimals();
      let supply;
      let balanceOfContract;
      let balanceOfAccount;

      balanceOfContract = toEth(
        await tokenContractObj?.balanceOf(StakingContractAddress)
      );
      // balanceOfAccount = toEth(await tokenContractObj?.balanceOf(account));
      // console.log("balanceOfContract =>", balanceOfContract);
      // console.log("balanceOfAccount =>", balanceOfAccount);

      if (decimal == 18) {
        supply = toEth(await tokenContractObj?.totalSupply());
        balanceOfContract = toEth(
          await tokenContractObj?.balanceOf(StakingContractAddress)
        );
        balanceOfAccount = toEth(await tokenContractObj?.balanceOf(account));
      } else if (decimal == 12) {
        supply = toEthA(await tokenContractObj?.totalSupply());
        balanceOfAccount = toEthA(await tokenContractObj?.balanceOf(account));
        balanceOfContract = toEthA(
          await tokenContractObj?.balanceOf(StakingContractAddress)
        );
      } else if (decimal == 6) {
        supply = toEthB(await tokenContractObj?.totalSupply());
        balanceOfAccount = toEthB(await tokenContractObj?.balanceOf(account));
        balanceOfContract = toEthB(
          await tokenContractObj?.balanceOf(StakingContractAddress)
        );
      }
      return {
        name,
        symbol,
        supply,
        decimal,
        address,
        balanceOfContract,
        balanceOfAccount,
      };
    } catch (error) {
      console.log("Error in getTokenData => ", error);
    }
  };

  const createPool = async (
    stakeToken: string,
    rewardToken: string,
    duration: number,
    rewardRate: number
  ) => {
    try {
      const contract = await getStakingContract();
      const tx = await contract?.createPool(
        stakeToken,
        rewardToken,
        duration,
        rewardRate
      );
      await tx.wait();
      setTransactionStatus(`Pool created successfully!`);
    } catch (error) {
      console.log("Error in createPool => ", error);
    }
  };

  async function getAllPoolsId() {
    try {
      const contract = await getStakingContract();
      const allPoolIds = await contract?.getAllPoolIds();
      return allPoolIds || [];
    } catch (error) {
      console.log("Error in getAllPoolsId:", error);
      return [];
    }
  }

  const getPoolData = async (poolId: number) => {
    try {
      const contract = await getStakingContract();
      const poolData = await contract?.pools(poolId);

      return poolData;
    } catch (error) {
      console.log("Error in getPoolData => ", error);
    }
  };

  const stopPool = async (poolId: number) => {
    try {
      const contract = await getStakingContract();
      const tx = await contract?.deactivePool(poolId);

      setTransactionStatus(`Pool stopped successfully!`);
    } catch (error) {
      console.log("Error in stopPool => ", error);
    }
  };

  const transferTokenToContract = async (
    amount: number,
    address: string,
    decimal: number
  ) => {
    try {
      const contract = await getStakingContract();
      let newAmount;
      if (decimal == 18) {
        newAmount = toWei(amount.toString());
      } else if (decimal == 12) {
        newAmount = toTokenA(amount.toString());
      } else if (decimal == 6) {
        newAmount = toTokenB(amount.toString());
      }
      console.log("Amount to transfer =>", amount);

      const tx = await contract?.transferTokenToContract(newAmount, address);
      return tx;
    } catch (error) {
      console.log("Error in transferTokenToContract => ", error);
    }
  };

  const setMinStakeAmount = async (amount: number, poolId: number) => {
    try {
      const contract = await getStakingContract();
      const tx = await contract?.setMinStakeAmount(amount, poolId);
      await tx.wait();
      setTransactionStatus(`Min stake amount set successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in setMinStakeAmount => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const stakeFunc = async (amount: number, poolId: number, decimal: number) => {
    try {
      const contract = await getStakingContract();
      if (decimal == 18) {
        const tx = await contract?.stake(toWei(amount.toString()), poolId);
      } else if (decimal == 12) {
        const tx = await contract?.stake(toTokenA(amount.toString()), poolId);
      } else if (decimal == 6) {
        const tx = await contract?.stake(toTokenB(amount.toString()), poolId);
      }
    } catch (error) {
      console.log("Error in stake => ", error);
    }
  };

  const calculateRewardFunc = async (poolId: number, decimal: number) => {
    try {
      const contract = await getStakingContract();

      const reward = await contract?.calculateProfit(account, poolId);
      if (decimal == 18) {
        return toEth(reward);
      } else if (decimal == 12) {
        return toEthA(reward);
      } else if (decimal == 6) {
        return toEthB(reward);
      }
      return reward;
    } catch (error) {
      console.log("Error in calculateReward => ", error);
    }
  };

  const withdrawAllAmountFunc = async (poolId: number) => {
    try {
      const contract = await getStakingContract();
      const tx = await contract?.withdrawAllAmount(poolId);
      await tx.wait();
      setTransactionStatus(`Withdraw successfully!`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in withdraw => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const withdrawSpecificProfitFunc = async (
    amount: number,
    poolId: number,
    decimal: number
  ) => {
    try {
      const contract = await getStakingContract();
      if (decimal == 18) {
        console.log("Withdrawing amount:", toWei(amount.toString()));

        const tx = await contract?.withdrawSpecificProfit(
          toWei(amount.toString()),
          poolId
        );
        await tx.wait();
        setTransactionStatus(`Withdraw successfully!`);
      } else if (decimal == 12) {
        const tx = await contract?.withdrawSpecificProfit(
          toTokenA(amount.toString()),
          poolId
        );
        await tx.wait();
        setTransactionStatus(`Withdraw successfully!`);
      } else if (decimal == 6) {
        const tx = await contract?.withdrawSpecificProfit(
          toTokenB(amount.toString()),
          poolId
        );
        await tx.wait();
        setTransactionStatus(`Withdraw successfully!`);
      }
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in withdrawSpecificProfit => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const withdrawProfitFunc = async (poolId: number) => {
    try {
      const contract = await getStakingContract();
      const tx = await contract?.withdrawProfit(poolId);
      await tx.wait();
      setTransactionStatus("Withdraw profit successfully!");
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in withdraw Profit => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const showMyBalancesInPoolFunc = async (poolId: number, decimal: number) => {
    try {
      const account = await connectWallet();
      const contract = await getStakingContract();
      const tx = await contract?.showMyBalancesInPool(account, poolId);
      if (decimal == 18) {
        const result = await toEth(tx);
        return result;
      } else if (decimal == 12) {
        const result = await toEthA(tx);
        return result;
      } else if (decimal == 6) {
        const result = await toEthB(tx);
        return result;
      }
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in show balance in pool => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const addReferralFunc = async (address: string) => {
    try {
      const contract = await getStakingContract();
      const tx = await contract?.addReferral(address);
      if (tx) {
        setTransactionStatus("Referral added successfully!");
      }
    } catch (error) {
      const errorMessage = (error as Error).message || "Transaction failed";
      console.log("Error in add referral => ", errorMessage);
      setTransactionStatus(`Transaction failed: ${errorMessage}`);
    }
  };

  const thisAcccountRefferedBy = async (address: string) => {
    try {
      const contract = await getStakingContract();
      const result = await contract?.referredBy(address);
      return result;
    } catch (error) {
      console.log("Error in thisAcccountRefferedBy => ", error);
    }
  };

  //region Graph Functions

  const QueryUrl =
    "https://api.studio.thegraph.com/query/88504/staking/version/latest";
  const client = createClient({
    url: QueryUrl,
  });

  const getUserData = async () => {
    const query = `{
          userDatas {
                user
                withdrawnProfit
                referredBy
                poolId
                id
                blockTimestamp
          }
      }`;

    const { data } = await client.query(query , {}).toPromise();
    // console.log("Data =>", data);
    return data.userDatas;
  };

  return (
    <ContractContext.Provider
      value={{
        contract,
        getTokenAAddress,
        getTokenBAddress,
        connectToWallet,
        account,
        getBuyARatio,
        getBuyBRatio,
        buyTokenA,
        buyTokenB,
        transactionStatus,
        setTransactionStatus,
        getTokenAAmount,
        getTokenBAmount,
        getFeePercentage,
        getSellARatio,
        getSellBRatio,
        sellTokenA,
        sellTokenB,
        hasValideAllowance,
        increaseAllowance,
        getAtoBSwapRatio,
        getBtoASwapRatio,
        swapTokenAToTokenB,
        swapTokenBToTokenA,
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
        getMaxSwapAmountForA,
        getMaxSwapAmountForB,
        getFeeAddress,
        createToken,
        getAllTokens,
        getTokenData,
        createPool,
        getAllPoolsId,
        getPoolData,
        hasValideAllowanceForStakingToken,
        increaseAllowanceForStakingToken,
        transferTokenToContract,
        stopPool,
        setMinStakeAmount,
        stakeFunc,
        withdrawAllAmountFunc,
        withdrawProfitFunc,
        withdrawSpecificProfitFunc,
        showMyBalancesInPoolFunc,
        calculateRewardFunc,
        addReferralFunc,
        thisAcccountRefferedBy,
        getUserData,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContextProvider;
