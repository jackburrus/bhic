import * as faceapi from 'face-api.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useAccount } from 'wagmi';
import { useGlobalStateContext } from './GlobalStateProvider';

const sbt_contract_address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

export function IdCard() {
	//fetch ethereum address
	const webcamRef = useRef<Webcam>(null);
	const { age, setAge, setMood, setGender, gender, mood, setImage } = useGlobalStateContext();

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
			// console.log(video);
			fetchAgeAndGender(video);
		}
	};

	useEffect(() => {
		faceDetected();
	}, []);

	return (
		<>
			<div className=" bg-[#f8f5de] shadow-customInset p-6 rounded-md flex flex-row w-[700px] h-96">
				<div className="flex border border-amber-200">
					<div className="flex ml-1 -rotate-2 w-1/3 flex-col justify-between  items-start mr-[2px]">
						<Webcam ref={webcamRef} className="z-10 rounded-sm" videoConstraints={{ width: 700, height: 800 }} />
						<img
							className="absolute bottom-2 right-10 -rotate-[25deg] rounded-full "
							alt="id-card"
							height={144}
							width={106}
							src="/ethlogo.png"
						/>
						<div onClick={capture} className="border rounded-sm p-1 border-black px-4">
							Mint
						</div>
					</div>
					<div className=" p-[8px]  flex w-3/4 flex-col ">
						<div className=" text-5xl  border-b border-amber-300 flex-1 flex">ID</div>
						<div className="border-b flex-1 border-amber-300 flex w-full items-start flex-col">
							<div>Address</div>

							<div className="text-sm">{account?.address.slice(0, 10) + '...'}</div>
						</div>
						<div className="border-b flex-1 border-amber-300 flex w-full items-start flex-col">
							<div>Age</div>
							<div>{age}</div>
						</div>

						<div className="border-b flex-1 border-amber-300 flex w-full items-start flex-col">
							<div>Gender</div>
							<div>{gender}</div>
						</div>
						<div className="border-b flex-1 border-amber-300 flex w-full items-start flex-col">
							<div>Mood</div>
							<div>{mood}</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
