This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.





 Swapping Contract





// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./tokenA.sol";
import "./tokenB.sol";

contract SwappingContract is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public tokenA;
    IERC20 public tokenB;
    uint256 public maxSupply = 1000000000000;

    address public feeAddress;
    uint256 public feePercentage = 1;

    uint256 public constant DECIMAL = 10 ** 18;
    uint256 public decimalOfA = 10 ** 12;
    uint256 public decimalOfB = 10 ** 6;

    uint256 public buyARatio = 1 * decimalOfA;
    uint256 public buyBRatio = 1 * decimalOfB;
    uint256 public AtoBSwapRatio = 1 * decimalOfA;
    uint256 public BtoASwapRatio = 1 * decimalOfB;
    uint256 public sellARatio = 1 * decimalOfA;
    uint256 public sellBRatio = 1 * decimalOfB;

    uint256 public maxSwapAmountForA;
    uint256 public maxSwapAmountForB;

    event BuyARatioUpdated(uint256 newRatio);
    event BuyBRatioUpdated(uint256 newRatio);
    event AtoBSwapRatioUpdated(uint256 newRatio);
    event BtoASwapRatioUpdated(uint256 newRatio);
    event SellARatioUpdated(uint256 newRatio);
    event SellBRatioUpdated(uint256 newRatio);
    event FeePercentageUpdated(uint256 newFeePercentage);
    event FeeAddressUpdated(address newFeeAddress);
    event MaxSwapAmountForAUpdated(uint256 newMaxSwapAmountForA);
    event MaxSwapAmountForBUpdated(uint256 newMaxSwapAmountForB);
    event OwnershipTransferredUpdate(address indexed previousOwner, address indexed newOwner);

    mapping(address => uint256) public tokenBalanceA;
    mapping(address => uint256) public tokenBalanceB;

    constructor() Ownable(msg.sender) {
        tokenA = new TokenA(maxSupply);
        tokenB = new TokenB(maxSupply);
        feeAddress = msg.sender;
    }

    function setNewOwnership(address newOwner) public onlyOwner {
        Ownable.transferOwnership(newOwner);
        emit OwnershipTransferredUpdate(owner(), newOwner);
    }

    function setMaxSwapAmountForA(uint256 _amount) public onlyOwner {
        maxSwapAmountForA = _amount;
        emit MaxSwapAmountForAUpdated(_amount);
    }

    function setMaxSwapAmountForB(uint256 _amount) public onlyOwner {
        maxSwapAmountForB = _amount;
        emit MaxSwapAmountForBUpdated(_amount);
    }

    function setBuyARatio(uint256 ratio) public onlyOwner {
        buyARatio = ratio;
        emit BuyARatioUpdated(ratio); 
    }

    function setBuyBRatio(uint256 ratio) public onlyOwner {
        buyBRatio = ratio;
        emit BuyBRatioUpdated(ratio); 
    }

    function setAtoBSwapRatio(uint256 ratio) public onlyOwner {
        AtoBSwapRatio = ratio;
        emit AtoBSwapRatioUpdated(ratio); 
    }

    function setBtoASwapRatio(uint256 ratio) public onlyOwner {
        BtoASwapRatio = ratio;
        emit BtoASwapRatioUpdated(ratio); 
    }

    function setSellARatio(uint256 ratio) public onlyOwner {
        sellARatio = ratio;
        emit SellARatioUpdated(ratio); 
    }

    function setSellBRatio(uint256 ratio) public onlyOwner {
        sellBRatio = ratio;
        emit SellBRatioUpdated(ratio); 
    }

    function setAtoBSwapRatioAsDefault() public onlyOwner {
        AtoBSwapRatio = ((buyBRatio * decimalOfB) / buyARatio) * decimalOfA;
        emit AtoBSwapRatioUpdated(AtoBSwapRatio); 
    }

    function setBtoASwapRatioAsDefault() public onlyOwner {
        BtoASwapRatio = (buyARatio / buyBRatio);
        emit BtoASwapRatioUpdated(BtoASwapRatio); 
    }

    function setSellARatioAsDefault() public onlyOwner {
        sellARatio = ((decimalOfA * decimalOfA) / buyARatio);
        emit SellARatioUpdated(sellARatio); 
    }

    function setSellBRatioAsDefault() public onlyOwner {
        sellBRatio = ((decimalOfB * decimalOfB) / buyBRatio);
        emit SellBRatioUpdated(sellBRatio); 
    }

    function setFeeAddress(address _feeAddress) public onlyOwner {
        feeAddress = _feeAddress;
        emit FeeAddressUpdated(_feeAddress); 
    }

    function setFeePercentage(uint256 _percentage) public onlyOwner {
        feePercentage = _percentage;
        emit FeePercentageUpdated(_percentage); 
    }

    function buyTokenA() public payable {
        uint256 totalAmount = msg.value;
        uint256 feeAmount = (msg.value * feePercentage) / 1000;
        uint256 amount = totalAmount - feeAmount;
        require(amount > 0, "Invalid amount");
        uint256 swapAmount = (amount * buyARatio * 10 ** 12) /
            (10 ** 18 * decimalOfA);
        require(
            address(msg.sender).balance >= amount,
            "you Have Insufficient balance"
        );
        require(
            tokenA.balanceOf(address(this)) >= swapAmount,
            "Insufficient balance of tokenA in contract"
        );
        tokenBalanceA[msg.sender] += swapAmount;
        payable(feeAddress).transfer(feeAmount);
        require(
            tokenA.transfer(msg.sender, swapAmount),
            "Transfer Token A failed"
        );
    }

    function buyTokenB() public payable {
        uint256 totalAmount = msg.value;
        uint256 feeAmount = (msg.value * feePercentage) / 1000;
        uint256 amount = totalAmount - feeAmount;
        require(amount > 0, "Invalid amount");
        uint256 swapAmount = (amount * buyBRatio * 10 ** 6) /
            (10 ** 18 * decimalOfB);
        require(
            address(msg.sender).balance >= amount,
            "you Have Insufficient balance"
        );
        require(
            tokenB.balanceOf(address(this)) >= swapAmount,
            "Insufficient balance of tokenB in Contract"
        );
        tokenBalanceB[msg.sender] += swapAmount;
        payable(feeAddress).transfer(feeAmount);
        require(
            tokenB.transfer(msg.sender, swapAmount),
            "Transfer Token B failed"
        );
    }

    function swapAtoB(uint256 _amount) public {
        require(_amount > 0, "Invalid amount");
        require(
            _amount <= maxSwapAmountForA,
            "Max Swap Amount for Token A reached"
        );
        uint256 swapAmount = (_amount * AtoBSwapRatio * 10 ** 6) /
            (10 ** 12 * decimalOfA);
        require(
            tokenBalanceA[msg.sender] >= _amount,
            "Insufficient balance of tokenA in user"
        );
        require(
            tokenB.balanceOf(address(this)) >= swapAmount,
            "Insufficient balance of tokenB in contract"
        );
        tokenBalanceA[msg.sender] -= _amount;
        tokenBalanceB[msg.sender] += swapAmount;
        require(
            tokenA.allowance(msg.sender, address(this)) >= _amount,
            "Allowance of tokenA is not enough"
        );
        require(
            tokenA.transferFrom(msg.sender, address(this), _amount),
            "Transfer Token A failed"
        );
        require(
            tokenB.transfer(msg.sender, swapAmount),
            "Transfer Token B failed"
        );
    }

    function swapBtoA(uint256 _amount) public {
        require(_amount > 0, "Invalid amount");
        require(
            _amount <= maxSwapAmountForB,
            "Max Swap Amount for Token B reached"
        );
        uint256 swapAmount = ((_amount * BtoASwapRatio) * 10 ** 12) /
            (10 ** 6 * decimalOfB);
        require(
            tokenBalanceB[msg.sender] >= _amount,
            "Insufficient balance of tokenB in user"
        );
        require(
            tokenB.allowance(msg.sender, address(this)) >= _amount,
            "Allowance of tokenB is not enough"
        );
        require(
            tokenA.balanceOf(address(this)) >= swapAmount,
            "Insufficient balance of tokenA in contract"
        );
        tokenBalanceB[msg.sender] -= _amount;
        tokenBalanceA[msg.sender] += swapAmount;
        require(
            tokenB.transferFrom(msg.sender, address(this), _amount),
            "Transfer Token B failed"
        );
        require(
            tokenA.transfer(msg.sender, swapAmount),
            "Transfer Token A failed"
        );
    }

    function swapAtoMatic(uint256 _amount) public {
        require(_amount > 0, "Invalid amount");
        uint256 swapAmount = ((_amount * sellARatio) * 10 ** 18) /
            (10 ** 12 * decimalOfA);
        require(
            tokenBalanceA[msg.sender] >= _amount,
            "Insufficient balance of tokenA in user"
        );
        require(
            address(this).balance >= swapAmount,
            "Insufficient balance of matic in contract"
        );
        tokenBalanceA[msg.sender] -= _amount;
        payable(msg.sender).transfer(swapAmount);

        require(
            tokenA.transferFrom(msg.sender, address(this), _amount),
            "Transfer Token A failed"
        );
    }

    function swapBtoMatic(uint256 _amount) public {
        require(_amount > 0, "Invalid amount");
        uint256 swapAmount = ((_amount * sellBRatio) * 10 ** 18) /
            (10 ** 6 * decimalOfB);
        require(
            tokenBalanceB[msg.sender] >= _amount,
            "Insufficient balance of tokenB in user"
        );
        require(
            address(this).balance >= swapAmount,
            "Insufficient balance of matic in contract"
        );
        tokenBalanceB[msg.sender] -= _amount;

        payable(msg.sender).transfer(swapAmount);
        require(
            tokenB.transferFrom(msg.sender, address(this), _amount),
            "Transfer Token B failed"
        );
    }
}
