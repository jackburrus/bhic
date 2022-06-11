import '../styles/global.css';
import { WagmiProvider } from 'ui';
import type { AppProps } from 'next/app';
import { createContext } from 'react';
import { GlobalStateProvider } from '@/components/GlobalStateProvider';

// create a global state provider using context

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<WagmiProvider>
			<GlobalStateProvider>
				<Component {...pageProps} />
			</GlobalStateProvider>
		</WagmiProvider>
	);
}

export default MyApp;
