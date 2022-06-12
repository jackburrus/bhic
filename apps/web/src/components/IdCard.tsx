import * as faceapi from 'face-api.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useAccount } from 'wagmi';
import { useGlobalStateContext } from './GlobalStateProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const truncateRegex = /^(0x[a-zA-Z0-9]{8})[a-zA-Z0-9]+([a-zA-Z0-9]{8})$/;
const truncateEthAddress = (address: string) => {
	const match = address.match(truncateRegex);
	if (!match) return address;
	return `${match[1]}…${match[2]}`;
};

const sbt_contract_address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

export function IdCard({ selectedOption }) {
	//fetch ethereum address
	const webcamRef = useRef<Webcam>(null);
	const { age, setAge, gender, mood, setGender, setMood } = useGlobalStateContext();

	const [{ data: account }] = useAccount();

	const [isLoaded, setIsLoaded] = useState<boolean>(false);

	const capture = useCallback(() => {
		const imageSrc = webcamRef.current.getScreenshot();

		console.log(imageSrc.toString());
	}, [webcamRef]);

	const loadModels = async () => {
		const MODEL_URL = '/models';
		await Promise.all([
			faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
			faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
			faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
			faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
			faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
		])
			.then(() => {
				console.log('its done');
			})
			.catch((err) => {
				console.log('error: ', err);
			});

		// const detection = await faceapi
		// .detectAllFaces(image, options)
		// //.withFaceExpressions()
		// .withAgeAndGender();
	};

	const loadWaiting = async () => {
		return new Promise((resolve) => {
			const timer = setInterval(() => {
				if (webcamRef.current?.video?.readyState == 4) {
					resolve(true);
					clearInterval(timer);
				}
			}, 500);
		});
	};

	const fetchAgeAndGender = async (video) => {
		const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
		const ageAndGender = await faceapi.predictAgeAndGender(video);
		const expressions = await faceapi.recognizeFaceExpressions(video);
		setAge(ageAndGender.age.toFixed(2));
		setGender(ageAndGender.gender);
		const finalExpression = Object.keys(expressions).reduce((a, b) => (expressions[a] > expressions[b] ? a : b));

		setMood(finalExpression);
		//find expressions with highest score
	};

	const faceDetected = async () => {
		await loadModels();
		await loadWaiting();
		if (webcamRef.current) {
			console.log('running');
			setIsLoaded(true);
			const webcam = webcamRef.current.video as HTMLVideoElement;

			webcam.width = webcam.videoWidth;
			webcam.height = webcam.videoHeight;

			const video = webcamRef.current.video;

			fetchAgeAndGender(video);
		}
	};

	const convertMood = (mood) => {
		switch (mood) {
			case 'happy':
				return 'High on life';
			case 'sad':
				return 'rekt';
			case 'angry':
				return 'karen';
			case 'neutral':
				return 'dgaf';
			case 'fearful':
				return 'scurred';
		}
	};

	const convertAge = (age) => {
		if (age < 25) {
			return 'Zoomer';
		} else if (age > 25 && age < 40) {
			return 'Boomer';
		} else if (age > 40 && age < 75) {
			return 'Old AF';
		} else {
			return 'Other';
		}
	};

	useEffect(() => {
		faceDetected();
	}, []);

	if (selectedOption.value === 'treasury') {
		return (
			<>
				<div className=" drop-shadow-xl relative  rounded-lg">
					<img onClick={faceDetected} src="/treasury.png" className=" rounded-md h-[400px]" />
					<Webcam
						ref={webcamRef}
						className="z-10 rounded-sm absolute bottom-10 right-12"
						videoConstraints={{ width: 195, height: 180 }}
					/>
					<div className="font-bold w-full   text-[#535143] -left-32 absolute opacity-90 top-[180px] text-lg ">
						{account?.address && truncateEthAddress(account?.address)}
					</div>
					<div className="font-bold w-full   text-[#535143] -left-[200px] absolute opacity-90 top-[210px] text-lg ">
						Age:{` `} {convertAge(age)}
					</div>
					<div className="font-bold w-full   text-[#535143] -left-[190px] absolute opacity-90 top-[240px] text-lg">
						Mood:{` `} {convertMood(mood)}
					</div>
					<div className="font-bold w-full   text-[#535143] -left-[180px] absolute opacity-90 top-[270px] text-lg">
						Gender:{` `} {gender}
					</div>
				</div>
			</>
		);
	}

	if (selectedOption.value === 'prison') {
		return (
			<>
				<div className=" drop-shadow-xl relative  rounded-lg">
					<img src="/prison.png" className=" rounded-md h-[400px]" />
					<Webcam
						ref={webcamRef}
						className="z-10 rounded-sm absolute left-3 top-1"
						videoConstraints={{ width: 245, height: 280 }}
					/>
					<div className="font-bold w-full -rotate-90  text-[#C5BEA5] left-[2px] absolute top-[200px] text-lg ">
						{account?.address && truncateEthAddress(account?.address)}
					</div>
					<div className="font-bold w-full -rotate-90  text-[#b7ad8b] left-[60px] absolute top-[310px] text-lg ">
						Age{` `} {Math.trunc(age.toString())}
					</div>
					<div className="font-bold w-full -rotate-[88deg]  text-[#b7ad8b] left-[160px] absolute top-[210px] text-lg ">
						Mood{` `} {convertMood(mood)}
					</div>
				</div>
			</>
		);
	}

	if (selectedOption.value === 'hawaii')
		return (
			<>
				<ToastContainer />
				<div className=" drop-shadow-xl shadow-customInset rounded-lg flex flex-row w-[700px] h-96">
					<img src="/hawaii.png" className="rounded-md" />
					<Webcam
						ref={webcamRef}
						className="z-10 rounded-sm absolute left-3 top-1"
						videoConstraints={{ width: 225, height: 260 }}
					/>
					<div className="font-bold opacity-80 text-[#2B2B2B] absolute top-20 text-lg left-[360px]">
						{account?.address && truncateEthAddress(account?.address)}
					</div>
					<div
						onClick={faceDetected}
						className=" bottom-12 font-bold opacity-80 text-[#2B2B2B] left-5 text-xl absolute"
					>
						McDegen
					</div>
					<div className="  font-bold opacity-80 text-[#2B2B2B] left-[260px] top-[235px] text-lg absolute">
						{/* //format new date day month year */}
						{new Date().toLocaleDateString('en-US', {
							month: 'short',
							day: 'numeric',
							year: 'numeric',
						})}
					</div>
					<div className="font-bold flex flex-col items-start opacity-90 text-[#2B2B2B] left-[255px] top-[265px] text-lg absolute">
						<div className=" text-[#2B2B2B]">GENDER</div>
						<div className=" text-[#2B2B2B]">{gender}</div>
					</div>
					<div className="font-bold flex flex-col items-start opacity-90 text-[#2B2B2B] left-[350px] top-[265px] text-lg absolute">
						<div className=" text-[#2B2B2B]">AGE</div>
						<div className=" text-[#2B2B2B]">{convertAge(age)}</div>
					</div>
					<div className="font-bold flex flex-col items-start opacity-90 text-[#2B2B2B] left-[450px] top-[265px] text-lg absolute">
						<div className=" text-[#2B2B2B]">VIBE</div>
						<div className=" text-[#2B2B2B]">{convertMood(mood)}</div>
					</div>
				</div>
			</>
		);

	return (
		<>
			<div className=" bg-[#f8f5de] drop-shadow-lg shadow-customInset p-6 rounded-lg flex flex-row w-[700px] h-96">
				<div className="flex border border-amber-200">
					<div className="flex ml-1 -rotate-2 w-1/3 flex-col justify-between  items-start mr-[2px]">
						<Webcam ref={webcamRef} className="z-10 rounded-sm" videoConstraints={{ width: 700, height: 800 }} />

						<img
							onClick={faceDetected}
							className="absolute bottom-2 right-10 -rotate-[25deg] rounded-full "
							alt="id-card"
							height={244}
							width={146}
							src="/ethprague.png"
						/>
						{/* <div onClick={capture} className="border rounded-sm p-1 border-black px-4">
							Mint
						</div> */}
					</div>
					<div className=" p-[8px]  flex w-3/4 flex-col ">
						<div className=" text-5xl  border-b border-amber-300 flex-1 flex">ID</div>
						<div className="border-b flex-1 border-amber-300 flex w-full items-start flex-col">
							<div>Address</div>

							<div className="text-sm">{account?.address && truncateEthAddress(account?.address)}</div>
						</div>
						<div className="border-b flex-1 border-amber-300 flex w-full items-start flex-col">
							<div>Age</div>
							<div>{age}</div>
						</div>

						<div className="border-b flex-1 border-amber-300 flex w-full items-start flex-col">
							<div>Gender</div>
							<div>{gender}</div>
						</div>
						<div className=" flex-1  flex w-full items-start flex-col">
							<div>Mood</div>
							<div>{convertMood(mood)}</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
