import { NFTStorage } from 'nft.storage';
import { useState } from 'react';

// read the API key from an environment variable. You'll need to set this before running the example!
// const API_KEY = process.env.NFT_STORAGE_API_KEY;
const API_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGJEMmFlOEQ2ZWJCODRkMjdiNmZCZGZDQTYxRjY4YTViNjFjOGIyRkIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDk1MTUwNTEwMSwibmFtZSI6InRlc3QifQ.3OdDBlimOp_wJnodvEOD1C1iiaIrH_gyVpEQs37NxbI';

function b64toBlob(dataURI) {
	var byteString = atob(dataURI.split(',')[1]);
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);

	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ab], { type: 'image/jpeg' });
}

const storeNFT = async (image: string) => {
	// change to get an image from the screen cam that slims it down to face block

	// need to pin the image to IPFS
	const imageBlob = b64toBlob(image);

	const nft = {
		image: imageBlob, // use image Blob as `image` field
		name: "Storing the World's Most Valuable Virtual Assets with NFT.Storage",
		description: 'The metaverse is here. Where is it all being stored?',
		properties: {
			type: 'blog-post',
			origins: {
				http: 'https://nft.storage/blog/post/2021-11-30-hello-world-nft-storage/',
				ipfs: 'ipfs://bafybeieh4gpvatp32iqaacs6xqxqitla4drrkyyzq6dshqqsilkk3fqmti/blog/post/2021-11-30-hello-world-nft-storage/',
			},
			authors: [{ name: 'David Choi' }],
			content: {
				'text/markdown':
					'The last year has witnessed the explosion of NFTs onto the world’s mainstage. From fine art to collectibles to music and media, NFTs are quickly demonstrating just how quickly grassroots Web3 communities can grow, and perhaps how much closer we are to mass adoption than we may have previously thought. <... remaining content omitted ...>',
			},
		},
	};

	const client = new NFTStorage({ token: API_KEY });
	const metadata = await client.store(image);

	console.log('NFT data stored!');
	console.log('Metadata URI: ', metadata.url);

	return metadata.url;
};

export const storeExampleNFT = (base64Image: string, metadata: { gender: string }) => {
	const [loading, setLoading] = useState(null);

	if (loading) {
		return loading;
	}

	return (
		<btn
			onClick={async () => {
				setLoading('loading');
				const i = await storeNFT(base64Image);
				setUri(i);
			}}
		>
			store example nft
		</btn>
	);
};
