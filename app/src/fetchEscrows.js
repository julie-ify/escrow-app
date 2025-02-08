import { ethers } from 'ethers';
import EscrowFactory from './artifacts/contracts/EscrowFactory.sol/EscrowFactory.json';

export async function fetchEscrows() {
	const factoryAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const factoryContract = new ethers.Contract(factoryAddress, EscrowFactory.abi, provider);

	try {
		const escrows = await factoryContract.getEscrows();
		return escrows;
	} catch (error) {
		console.error('Error fetching escrows:', error);
	}
}
