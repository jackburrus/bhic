import Webcam from 'react-webcam';

export function IdCard() {
	return (
		<div className=" bg-[#DAD3B9] p-6 rounded-md flex flex-row w-[700px] h-96">
			<div className="flex border border-orange-300">
				<div className="flex ml-1 -rotate-2 w-1/3   items-start mr-[2px]">
					<Webcam videoConstraints={{ width: 700, height: 800 }} />
				</div>
				<div className="border-orange-500 p-[3px] border flex w-3/4 flex-col ">
					<div className="border-b-2 border-orange-500 flex-1 flex">Degen</div>
					<div className="border-b-2 flex-1 border-orange-500 flex w-full">Name</div>
					<div className="border-b-2 flex-1 border-orange-500 flex w-full">Age</div>
					<div className="border-b-2 flex-1 border-orange-500 flex w-full">Gender</div>
				</div>
			</div>
		</div>
	);
}
