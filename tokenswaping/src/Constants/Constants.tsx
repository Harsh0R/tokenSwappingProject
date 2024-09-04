import swapABI from "./SwappingContract.json";
import tokenABI from "./TokenA.json";
import myCustomTokenABI from "./MyCustomToken.json";
import stakeABI from "./TokenStaking.json"

const SwappingContractAddress = '0xB7DF1349CE01A967806388Ff7e0BAbBC4b6ed3af';
const StakingContractAddress = '0x4420130D8220fD72075faC9f3d83540bE25ACF28';

const tokenAbi = tokenABI.abi;
const swapAbi = swapABI.abi;
const stakeAbi = stakeABI.abi;
const myCustomTokenAbi = myCustomTokenABI.abi;



export { swapAbi, tokenAbi, SwappingContractAddress , StakingContractAddress , myCustomTokenABI , stakeAbi , myCustomTokenAbi };