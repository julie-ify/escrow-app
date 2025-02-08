require('@nomicfoundation/hardhat-toolbox');

require('dotenv').config();

module.exports = {
	solidity: '0.8.27',
	networks: {
		sepolia: {
			url: process.env.ALCHEMY_TESTNET_RPC_URL,
			accounts: [process.env.TESTNET_PRIVATE_KEY],
		},
		local: {
			url: 'http://localhost:8545',
			accounts: [process.env.LOCAL_HARDHAT_PRIVATE_KEY],
		},
	},
	paths: {
		artifacts: '../app/src/artifacts',
	},
};
