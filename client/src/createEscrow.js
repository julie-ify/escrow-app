import { ethers } from 'ethers';
import EscrowFactory from './artifacts/contracts/EscrowFactory.sol/EscrowFactory.json';

export default async function createEscrowContract(
	signer,
	arbiter,
	beneficiary,
	value
) {
	const factoryAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with actual factory address

	const factory = new ethers.Contract(
		factoryAddress,
		EscrowFactory.abi,
		signer
	);
	const tx = await factory.createEscrow(arbiter, beneficiary, { value });
	const receipt = await tx.wait();

	// Extract escrow contract address from event logs
	const event = receipt.events.find((e) => e.event === 'EscrowCreated');
	const escrowAddress = event.args.escrowAddress;

	console.log('Escrow deployed at:', escrowAddress);
	return escrowAddress;
}
