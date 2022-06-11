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

const hasEthereum = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const ID_TYPES = ['DEGEN', 'STANDARD', 'DPRK', 'TUPAC', 'WORKPLACE'];

const sbt_contract_address = '0x766f3a30d11337382beded1ba5cc88dd7c0c02f0';

export default function Web() {
	const inputRef = React.useRef<HTMLInputElement>();
	const { age, mood, gender, image, setImage } = useGlobalStateContext();
	const [status, setStatus] = React.useState<'loading...' | 'complete'>('complete');
	const [currentStore, setCurrentStore] = React.useState('');
	const [{ data: account }] = useAccount();
	const [activeIdType, setActiveIdType] = React.useState(ID_TYPES[0]);

	console.log(age);

	const sbt = useContractWrite<SBT>(
		{
			addressOrName: contractAddress,
			contractInterface: SBT__factory.abi,
		},
		'set',
	);

	// const soulRead = useContractRead<SBT>(
	// 	{
	// 		addressOrName: contractAddress,
	// 		contractInterface: SBT__factory.abi,
	// 	},
	// 	`getSoul`,
	// 	{ args: [account.address] },
	// );
	// console.log(soulRead);

	const mint = async () => {
		if (hasEthereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum as any);
			const signer = provider.getSigner();
			const sbtContract = SBT__factory.connect(sbt_contract_address, signer);

			try {
				const tx = await sbtContract.mint(account.address, {
					soul: account.address,
					age: age,
					mood: mood,
					gender: gender,
					identity: account.address,
				});
				if (tx.data) {
					console.log(tx);
					// const receipt = await tx.data.wait();
					// if (receipt.status === 1) {
					// 	setCurrentStore(receipt.gasUsed);
					// }
				}
			} catch (err) {
				console.log(err);
			}
		}
	};

	const fetchSoul = async () => {
		//read soul contract
		if (hasEthereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum as any);
			const signer = provider.getSigner();
			const sbtContract = SBT__factory.connect(sbt_contract_address, signer);
			try {
				const soul = await sbtContract.getSoul(account.address);
				console.log(soul);
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<div className="max-w-lg mt-36 mx-auto items-center justify-center text-center px-4">
			<Head>
				<title>Next.js Dapp Starter Ts</title>
			</Head>

			<main className="space-y-8 flex items-center flex-col">
				<>
					<div className="flex flex-col space-y-4">
						<WalletConnectModal />
					</div>
					<h1 className="text-4xl font-semibold mb-8">Mint your own ID</h1>
					<div className="cursor-pointer" onClick={mint}>
						Mint
					</div>
					<div onClick={fetchSoul}>Get Soul</div>
					{/* <div>Active ID type: {activeIdType}</div> */}
					{/* <div className="flex items-center justify-center  flex-row ">
						{ID_TYPES.map((idType) => (
							<Button onClick={() => setActiveIdType(idType)} key={idType} className="mr-2 mb-4">
								{idType}
							</Button>
						))}
					</div> */}
					<IdCard />

					{/* <h1 className="text-4xl font-semibold mb-8">Next.js Dapp Starter Ts</h1>
					<p>Store Value : {currentStore} </p>
					<p>transaction status : {status} </p>
					<div className="space-y-8">
						<div className="space-y-8">
							<form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
								<input
									className="border p-4 text-center"
									placeholder="Write a new greeting"
									name="datas"
									ref={inputRef}
									type="text"
									min={1}
									required
								/>
								<Button
									className="disabled:bg-blue-400 disabled:cursor-not-allowed"
									type="submit"
									disabled={account?.address === undefined}
								>
									Say it??
								</Button>
							</form>
						</div>
						<div className="flex flex-col space-y-4">
							<WalletConnectModal />
						</div>
					</div> */}
				</>
			</main>
		</div>
	);
}
