import * as faceapi from "face-api.js";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useGlobalStateContext } from "./GlobalStateProvider";
import { NFTStorage } from "nft.storage";
import { useAccount } from "wagmi";

// read the API key from an environment variable. You'll need to set this before running the example!
// const API_KEY = process.env.NFT_STORAGE_API_KEY;
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGJEMmFlOEQ2ZWJCODRkMjdiNmZCZGZDQTYxRjY4YTViNjFjOGIyRkIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDk1MTUwNTEwMSwibmFtZSI6InRlc3QifQ.3OdDBlimOp_wJnodvEOD1C1iiaIrH_gyVpEQs37NxbI";

function b64toBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: "image/jpeg" });
}

const sbt_contract_address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export function IdCard() {
  //fetch ethereum address
  const webcamRef = useRef<Webcam>(null);
  const { age, mood, gender, image, setAge, setMood, setGender, setImage } =
    useGlobalStateContext();
  const [loading, setLoading] = useState(null);

  const [{ data: account }] = useAccount(); // must be used within a provider

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();

    console.log(imageSrc.toString());
  }, [webcamRef]);

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ])
      .then(() => {
        console.log("its done");
      })
      .catch((err) => {
        console.log("error: ", err);
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
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();
    const ageAndGender = await faceapi.predictAgeAndGender(video);
    const expressions = await faceapi.recognizeFaceExpressions(video);
    setAge(ageAndGender.age.toFixed(2));
    setGender(ageAndGender.gender);
    const finalExpression = Object.keys(expressions).reduce((a, b) =>
      expressions[a] > expressions[b] ? a : b
    );

    setMood(finalExpression);
    //find expressions with highest score
  };

  const faceDetected = async () => {
    await loadModels();
    await loadWaiting();
    if (webcamRef.current) {
      console.log("running");
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

  const storeNFT = async (image: string) => {
    const imageBlob = b64toBlob(image);

    // get the image to ipfs
    const osStandardNft = {
      image: imageBlob,
      name: "to name",
      description: "BHIC",
      properties: {
        external_url: "https://boredhumaninternetclub.com",
        name: "BHIC #",
        attributes: [
          {
            trait_type: "age",
            value: age,
          },
          {
            trait_type: "mood",
            value: mood,
          },
          {
            trait_type: "gender",
            value: gender,
          },
        ],
        authors: [{ name: "us" }],
      },
    };

    const client = new NFTStorage({ token: API_KEY });
    const metadata = await client.store(osStandardNft); // set to nft or image

    setImage(metadata);

    console.log("NFT data stored!");
    console.log("Metadata URI: ", metadata.url);
    console.log("Global Context Metadata", {
      todo: "fdjskal",
    });

    return metadata.url;
  };
  const storeExampleNFT = (base64Image: string) => {
    if (loading) {
      return loading;
    }

    return (
      <btn
        onClick={async () => {
          setLoading("loading");

          await storeNFT(base64Image);
        }}
      >
        store example nft
      </btn>
    );
  };

  const showStoreNFT = () => {
    if (!image) {
      return storeExampleNFT(
        `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM0AAAD
	NCAMAAAAsYgRbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5c
	cllPAAAABJQTFRF3NSmzMewPxIG//ncJEJsldTou1jHgAAAARBJREFUeNrs2EEK
	gCAQBVDLuv+V20dENbMY831wKz4Y/VHb/5RGQ0NDQ0NDQ0NDQ0NDQ0NDQ
	0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0PzMWtyaGhoaGhoaGhoaGhoaGhoxtb0QGho
	aGhoaGhoaGhoaGhoaMbRLEvv50VTQ9OTQ5OpyZ01GpM2g0bfmDQaL7S+ofFC6x
	v3ZpxJiywakzbvd9r3RWPS9I2+MWk0+kbf0Hih9Y17U0nTHibrDDQ0NDQ0NDQ0
	NDQ0NDQ0NTXbRSL/AK72o6GhoaGhoRlL8951vwsNDQ0NDQ1NDc0WyHtDTEhD
	Q0NDQ0NTS5MdGhoaGhoaGhoaGhoaGhoaGhoaGhoaGposzSHAAErMwwQ2HwRQ
	AAAAAElFTkSuQmCC`
      );
    }
  };

  return (
    <>
      <div className=" bg-[#f8f5de] shadow-customInset p-6 rounded-md flex flex-row w-[700px] h-96">
        <div className="flex border border-amber-200">
          <div className="flex ml-1 -rotate-2 w-1/3 flex-col justify-between  items-start mr-[2px]">
            {showStoreNFT()}

            {console.log(image, "image d")}
            <Webcam
              ref={webcamRef}
              className="z-10 rounded-sm"
              videoConstraints={{ width: 700, height: 800 }}
            />
            <img
              className="absolute bottom-2 right-10 -rotate-[25deg] rounded-full "
              alt="id-card"
              height={144}
              width={106}
              src="/ethlogo.png"
            />
            <div
              onClick={capture}
              className="border rounded-sm p-1 border-black px-4"
            >
              Mint
            </div>
          </div>
          <div className=" p-[8px]  flex w-3/4 flex-col ">
            <div className=" text-5xl  border-b border-amber-300 flex-1 flex">
              ID
            </div>
            <div className="border-b flex-1 border-amber-300 flex w-full items-start flex-col">
              <div>Address</div>

              <div className="text-sm">
                {account?.address.slice(0, 10) + "..."}
              </div>
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
