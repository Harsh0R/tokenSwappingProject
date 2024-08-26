import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const Navbar = () => {
    return (
        <div className="flex justify-between items-center bg-black p-4 h-16 w-full border-b-2 border-white ">
            <div className="text-xl font-bold text-white">Token Swapping</div>
            <div>
                <ConnectButton 
                    label='Connect Wallet' 
                    accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }} 
                    chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }} 
                    showBalance={{ smallScreen: false, largeScreen: true }} 
                />
            </div>
        </div>
    );
}

export default Navbar;
