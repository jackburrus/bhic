import { WithFaceLandmarks, FaceDetection } from 'face-api.js';
// const ua = window.navigator.userAgent.toLowerCase();
// const mq = window.matchMedia('(max-width: 768px)');
// const sp = mq.matches ? true : false;
// const getLayout = (): void => {
// 	sp;
// };
// if (ua.indexOf('msie') !== -1 || ua.indexOf('trident') !== -1) {
// 	console.log('error');
// } else {
// 	mq.addEventListener('change', getLayout.bind(this));
// }

export const checkFace = async (
	detectAllFaces: WithFaceLandmarks<{
		detection: FaceDetection;
	}>[],
	canvas: HTMLCanvasElement,
	selectFrame: HTMLSelectElement,
	selectColor: HTMLSelectElement,
) => {
	detectAllFaces.map((detectsAllFaces) => {
		console.log(detectAllFaces);
		// const ctx = canvas.getContext('2d');
		// const image = document.createElement('img');
		// image.onload = () => {
		// 	if (!sp) {
		// 		//pc
		// 		const width = detectsAllFaces.detection.box.width * 0.75;
		// 		const height = detectsAllFaces.detection.box.height * 0.25;
		// 		const x = detectsAllFaces.detection.box.x + width * 0.2;
		// 		const y = detectsAllFaces.detection.box.y + height * 0.6;
		// 		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// 		ctx.drawImage(image, x, y, width, height);
		// 	} else {
		// 		//sp
		// 		const width = detectsAllFaces.detection.box.width * 0.5;
		// 		const height = detectsAllFaces.detection.box.height * 0.15;
		// 		const x = detectsAllFaces.detection.box.x - width * 0.2;
		// 		const y = detectsAllFaces.detection.box.y - height * 1.4;
		// 		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// 		ctx.drawImage(image, x, y, width, height);
		// 	}
		// };
		// image.src = `/img/${selectFrame.value}-${selectColor.value}.png`;
	});
};
