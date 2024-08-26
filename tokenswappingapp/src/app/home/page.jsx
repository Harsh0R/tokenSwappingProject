'use client';
import { useContext, useEffect, useState } from "react";
import { ContractContext } from "../../Context/contractContect";
import SwapComponent from "../../Components/SwapComponent/SwapComponent";
import BuyToken from "../../Components/BuyTokenComponent/BuyToken";

const Home = () => {
    const [tokenA, setTokenA] = useState();
    const [tokenB, setTokenB] = useState();
    const { getTokenAAddress, getTokenBAddress, swapTokens } = useContext(ContractContext);

    const getTokenAAddress1 = async () => {
        try {
            const tokenAddress = await getTokenAAddress();
            setTokenA(tokenAddress);
        } catch (error) {
            console.error("Error fetching Token A address:", error);
        }
    };

    const getTokenBAddress1 = async () => {
        try {
            const tokenBAddress = await getTokenBAddress();
            setTokenB(tokenBAddress);
        } catch (error) {
            console.error("Error fetching Token B address:", error);
        }
    };

    useEffect(() => {
        getTokenAAddress1();
        getTokenBAddress1();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div>
                <BuyToken tokenAddress={tokenA} />
                <BuyToken tokenAddress={tokenB} />
            </div>
            <div className="flex flex-col justify-center items-center bg-gray-800 p-6 rounded-lg shadow-lg">
                <SwapComponent swapTokens={swapTokens} />
            </div>
        </div>
    );
};

export default Home;
