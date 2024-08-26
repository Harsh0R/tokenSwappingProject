import React, { useState, useEffect } from "react";

const SwapComponent = ({ swapTokens }) => {
    const [tokenAAmount, setTokenAAmount] = useState("");
    const [tokenBAmount, setTokenBAmount] = useState("");
    const [swapRatio, setSwapRatio] = useState(1); // Assuming a 1:1 swap ratio for simplicity, replace with actual ratio

    // Handle the amount input for Token A
    const handleTokenAChange = (e) => {
        const value = e.target.value;
        setTokenAAmount(value);

        // Calculate and set the equivalent Token B amount based on the swap ratio
        if (value) {
            setTokenBAmount((value * swapRatio).toFixed(6)); // Adjust decimal precision as needed
        } else {
            setTokenBAmount("");
        }
    };

    // Handle the amount input for Token B
    const handleTokenBChange = (e) => {
        const value = e.target.value;
        setTokenBAmount(value);

        // Calculate and set the equivalent Token A amount based on the swap ratio
        if (value) {
            setTokenAAmount((value / swapRatio).toFixed(6)); // Adjust decimal precision as needed
        } else {
            setTokenAAmount("");
        }
    };

    // Placeholder function to perform the swap (replace with actual logic)
    const performSwap = () => {
        swapTokens(tokenAAmount, tokenBAmount);
    };

    return (
        <div className="flex flex-col items-center bg-gray-700 p-4 rounded-lg shadow-lg">
            <div className="text-white mb-2">Swap Tokens</div>

            {/* Token A Input */}
            <div className="flex flex-col mb-4">
                <label className="text-white">Token A Amount:</label>
                <input
                    type="number"
                    value={tokenAAmount}
                    onChange={handleTokenAChange}
                    className="p-2 rounded-lg bg-gray-800 text-white"
                />
            </div>

            {/* Token B Input */}
            <div className="flex flex-col mb-4">
                <label className="text-white">Token B Amount:</label>
                <input
                    type="number"
                    value={tokenBAmount}
                    onChange={handleTokenBChange}
                    className="p-2 rounded-lg bg-gray-800 text-white"
                />
            </div>

            {/* Swap Button */}
            <button
                onClick={performSwap}
                className="bg-green-500 text-white p-2 rounded-lg"
            >
                Swap
            </button>
        </div>
    );
};

export default SwapComponent;
