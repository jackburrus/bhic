import Image from 'next/image';
import Webcam from 'react-webcam';

export function IdCard() {
	return (
		<div className=" bg-[#D8B992] p-6 rounded-md flex flex-row w-[700px] h-96">
			<div className="flex border border-orange-300">
				<div className="flex ml-1 -rotate-2 w-1/3 flex-col  items-start mr-[2px]">
					<Webcam className="z-10" videoConstraints={{ width: 700, height: 800 }} />
					<img
						className="absolute bottom-2 right-10 -rotate-[25deg] rounded-full "
						alt="id-card"
						height={144}
						width={106}
						src="/ethlogo.png"
					/>
				</div>
				<div className="border-orange-500 p-[3px] border flex w-3/4 flex-col ">
					<div className=" text-5xl border-b-2 border-orange-500 flex-1 flex">ID</div>
					<div className="border-b-2 flex-1 border-orange-500 flex w-full">Name</div>
					<div className="border-b-2 flex-1 border-orange-500 flex w-full">Age</div>
					<div className="border-b-2 flex-1 border-orange-500 flex w-full">Gender</div>
				</div>
			</div>
		</div>
	);
}
