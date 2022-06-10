import { Button, WalletConnectModal } from 'ui';
import Head from 'next/head';
import { useContractWrite, useAccount } from 'wagmi';
import { Storage__factory, Storage } from '@/typechain';
import { ethers } from 'ethers';
import * as React from 'react';
import Webcam from 'react-webcam';
import { IdCard } from '@/components/IdCard';

const hasEthereum = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const ID_TYPES = ['DEGEN', 'STANDARD', 'DPRK', 'TUPAC', 'WORKPLACE'];

export default function Web() {
	const inputRef = React.useRef<HTMLInputElement>();
	const [status, setStatus] = React.useState<'loading...' | 'complete'>('complete');
	const [currentStore, setCurrentStore] = React.useState('');
	const [{ data: account }] = useAccount();
	const [activeIdType, setActiveIdType] = React.useState(ID_TYPES[0]);
	const [{}, set] = useContractWrite<Storage>(
		{
			addressOrName: contractAddress,
			contractInterface: Storage__factory.abi,
		},
		'set',
	);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (hasEthereum) {
			const inputState = inputRef.current.value;

			const tx = await set({ args: inputState });
			setStatus('loading...');
			if (tx.data) {
				const receipt = await tx.data.wait();
				if (receipt.status === 1) {
					setCurrentStore(inputState);
					inputRef.current.value = '';
				}
				setStatus('complete');
			}
		}
	}

	React.useEffect(() => {
		async function fetchStore() {
			if (hasEthereum) {
				const provider = new ethers.providers.Web3Provider(window.ethereum as any);
				const storageContract = Storage__factory.connect(contractAddress, provider);
				try {
					const data = await storageContract.retrieve();
					setCurrentStore(data);
				} catch (err) {
					console.log('EfetchStorerror: ', err);
				}
			}
		}
		fetchStore();
	}, []);

	return (
		<div className="max-w-lg mt-36 mx-auto items-center justify-center text-center px-4">
			<Head>
				<title>Next.js Dapp Starter Ts</title>
			</Head>

			<main className="space-y-8 flex items-center flex-col">
				<>
					<h1 className="text-4xl font-semibold mb-8">Select an ID Style</h1>
					<div>Active ID type: {activeIdType}</div>
					<div className="flex items-center justify-center  flex-row ">
						{ID_TYPES.map((idType) => (
							<Button onClick={() => setActiveIdType(idType)} key={idType} className="mr-2 mb-4">
								{idType}
							</Button>
						))}
					</div>

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
