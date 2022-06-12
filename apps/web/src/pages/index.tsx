import { Button, WalletConnectModal } from 'ui';
import Head from 'next/head';
import { useContractWrite, useAccount, useBlockNumber, useContractRead } from 'wagmi';
import { Storage__factory, Storage, SBT, SBT__factory } from '@/typechain';
import { ethers } from 'ethers';
import * as React from 'react';
import Webcam from 'react-webcam';
import { IdCard } from '@/components/IdCard';
import UploadImage from '@/components/UploadImage';
import { File, NFTStorage } from 'nft.storage';
import { useGlobalStateContext } from '@/components/GlobalStateProvider';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

const hasEthereum = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const ID_TYPES = ['DEGEN', 'STANDARD', 'DPRK', 'TUPAC', 'WORKPLACE'];

const sbt_contract_address = '0x80593329ba8a82f5ceaff010b832026fb1ea4f38';

export default function Web() {
	const inputRef = React.useRef<HTMLInputElement>();
	const { age, image, gender, mood, setAge, setMood, setGender } = useGlobalStateContext();
	const [status, setStatus] = React.useState<'loading...' | 'complete'>('complete');
	const [currentStore, setCurrentStore] = React.useState('');
	const [{ data: account }] = useAccount();
	const [activeIdType, setActiveIdType] = React.useState(ID_TYPES[0]);
	const [localSoul, setLocalSoul] = React.useState(null);
	const [minted, setMinted] = React.useState(false);
	const [selectedOption, setSelectedOption] = React.useState({ value: 'hawaii', label: '🌴' });

	const options = [
		{ value: 'classic', label: 'Classic' },
		{ value: 'hawaii', label: '🌴' },
		{ value: 'Tupac', label: 'Tupac' },
	];

	const sbt = useContractWrite<SBT>(
		{
			addressOrName: contractAddress,
			contractInterface: SBT__factory.abi,
		},
		'set',
	);

	const RinkebyToast = (tx) => (
		<div>
			<a target={'_blank'} href={`https://rinkeby.etherscan.io/tx/${tx}`} rel="noreferrer">
				Link to tx ⛓️
			</a>
		</div>
	);

	const mint = async () => {
		if (hasEthereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum as any);
			const signer = provider.getSigner();
			const sbtContract = SBT__factory.connect(sbt_contract_address, signer);
			try {
				console.log(account.address);
				const tx = await sbtContract.mint(account.address, {
					soul: account.address,
					age: age,
					mood: mood,
					gender: gender,
					identity: account.address,
				});
				if (tx.data) {
					console.log(tx);
					//view etherscan link on rinkeby

					toast.success(RinkebyToast(tx.hash));
				}
			} catch (err) {
				console.log(err);
			}
		}
	};

	const fetchSoul = async () => {
		if (hasEthereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum as any);
			const signer = provider.getSigner();
			const sbtContract = SBT__factory.connect(sbt_contract_address, signer);
			try {
				const soul = await sbtContract.getSoul(account.address);
				console.log(soul);
				setAge(soul.age);
				setGender(soul.gender);
				setMood(soul.mood);
			} catch (err) {
				console.log(err);
			}
		}
	};

	React.useEffect(() => {
		fetchSoul();
	}, []);

	return (
		<div className="w-screen h-screen bg-gradient-to-r from-rose-400 to-orange-300  mx-auto items-center justify-center text-center ">
			<Select
				className="w-28 absolute top-10 left-10"
				defaultValue={selectedOption}
				onChange={setSelectedOption}
				options={options}
			/>
			<main className="space-y-4 flex items-center flex-col ">
				<>
					{/* <div className="flex flex-col space-y-4">
						<WalletConnectModal />
					</div> */}
					<h1 className="text-4xl font-semibold mt-24 text-white ">Mint your own ID</h1>
					<div className="flex  w-56 justify-evenly  flex-row">
						<div className="border border-white text-white cursor-pointer p-2  rounded px-5" onClick={mint}>
							Mint
						</div>
						<div className=" cursor-pointer border p-2 border-white text-white rounded px-5" onClick={fetchSoul}>
							Get ID
						</div>
					</div>
					<div>{minted && 'Thanks for minting you ID'}</div>

					<div>{localSoul && 'You already have an ID'}</div>

					<IdCard selectedOption={selectedOption} />
					<ToastContainer />
				</>
			</main>
		</div>
	);
}
