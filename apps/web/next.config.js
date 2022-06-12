const withTM = require('next-transpile-modules')(['ui']);
const path = require('path');
/** @type {import('next').NextConfig} */
module.exports = withTM({
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	reactStrictMode: true,
	webpack: (config, options) => {
		if (options.isServer) {
			config.externals = ['wagmi', 'ethers', '@headlessui/react', ...config.externals];
		}
		config.resolve.alias['wagmi'] = path.resolve(__dirname, '.', 'node_modules', 'wagmi');
		config.resolve.alias['ethers'] = path.resolve(__dirname, '.', 'node_modules', 'ethers');
		config.resolve.alias['@headlessui/react'] = path.resolve(__dirname, '.', 'node_modules', '@headlessui/react');
		return config;
	},
});
