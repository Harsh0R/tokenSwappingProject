"use client";
import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { connectWallet } from "@/Utils/utilsFunctions";
import { ContractContext } from "@/Context/contractContect";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";


const Navbar: React.FC = () => {
  const { account } = useContext(ContractContext);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/">Techmont</Link>
        </div>

        {/* Navigation Links */}
        <NavigationMenu className="hidden md:flex space-x-6">
          <NavigationMenuList className="flex space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/swap">Swap</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/stake">Stake</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/buytokens">Buy Tokens</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/admin">Admin</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Wallet Button */}
        {/* {account ? (
          <Button
            variant={account ? "solid" : "outline"}
            className="bg-purple-600"
            onClick={connectWallet}
          >
            Connected to {account.slice(0, 6)}...{account.slice(-4)}
          </Button>
        ) : (
          <Button
            variant={account ? "solid" : "outline"}
            className="bg-purple-600"
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        )} */}

          <ConnectButton/>

      </div>
    </nav>
  );
};

export default Navbar;
