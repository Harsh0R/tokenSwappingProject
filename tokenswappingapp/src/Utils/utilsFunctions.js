import { ethers } from "ethers";
import { contractAddress, swapAbi, tokenAbi } from "../Constants/Constants";

export function toWei(amount, decimal = 18) {
  const toWei = ethers.utils.parseUnits(amount, decimal);
  return toWei.toString();
}

export function toEth(amount, decimal = 18) {
  const toEth = ethers.utils.formatUnits(amount, decimal);
  return toEth.toString();
}

export const checkIfWalletConnected = async () => {
  try {
    if (!window.ethereum) {
      return console.log("INSTALL METAMASk");
    }

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    const firstAccount = accounts[0];
    return firstAccount;
  } catch (error) {
    console.log(error);
  }
};

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      alert("Please install Metamask");
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const firstAccount = accounts[0];
    return firstAccount;
  } catch (error) {
    console.log("error in connectWallet => ", error);
  }
};

export const connectContract = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, swapAbi, signer);
    return contract;
  } catch (error) {
    console.log("error => ", error);
  }
};

export const getTokenContract = async (tokenContractAddress) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(
      tokenContractAddress,
      tokenAbi,
      signer
    );
    return tokenContract;
  } catch (error) {
    console.log("error in getTokenContract => ", error);
  }
};
