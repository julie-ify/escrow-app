import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import createEscrowContract from './createEscrow';
import Escrow from './components/Escrow';
import { fetchEscrows } from './fetchEscrows';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
	try {
		const approveTxn = await escrowContract.connect(signer).approve();
		await approveTxn.wait();
	} catch (error) {
		console.error('Approval failed:', error);
		alert('Transaction failed! Please check your wallet.');
	}
}

function App() {
	const [escrows, setEscrows] = useState([]);
	const [account, setAccount] = useState(null);
	const [signer, setSigner] = useState(null);

	useEffect(() => {
		async function fetchEscrowsAsync() {
			const escrows = await fetchEscrows(signer);
			setEscrows(escrows);
		}
		async function checkWalletConnection() {
			const accounts = await provider.listAccounts();
			if (accounts.length > 0) {
				setAccount(accounts[0]);
				setSigner(provider.getSigner());
			}
		}
		checkWalletConnection();
		fetchEscrowsAsync();
	}, []);

	const connectWallet = async () => {
		try {
			const accounts = await provider.send('eth_requestAccounts', []);
			setAccount(accounts[0]);
			setSigner(provider.getSigner());
		} catch (error) {
			if (error.code === 4001) {
				console.log('Please connect to MetaMask.');
			} else {
				console.error(error);
			}
		}
	};

	const disconnectWallet = async () => {
		// MetaMask does not support "disconnect", so we clear the state instead
		setAccount(null);
		setSigner(null);
	};

	async function newContract() {
		const beneficiary = document.getElementById('beneficiary').value;
		const arbiter = document.getElementById('arbiter').value;
		const value = ethers.utils.parseEther(document.getElementById('wei').value); // Converts to Wei

		const escrowAddress = await createEscrowContract(
			signer,
			arbiter,
			beneficiary,
			value
		);
		console.log('New contract deployed at:', escrowAddress);
	}

	return (
		<div className="container">
			<div className="connect-btn-wrap">
				{!account ? (
					<div className="button" onClick={connectWallet}>
						<p>Connect</p>
					</div>
				) : (
					<div className="button" onClick={disconnectWallet}>
						<p>Disconnect</p>
					</div>
				)}
			</div>

			<div className="contract">
				<h1> New Contract </h1>
				<label>
					Arbiter Address
					<input type="text" id="arbiter" />
				</label>

				<label>
					Beneficiary Address
					<input type="text" id="beneficiary" />
				</label>

				<label>
					Deposit Amount (in ETH)
					<input type="text" id="wei" />
				</label>

				<div
					className="button"
					id="deploy"
					onClick={(e) => {
						e.preventDefault();
						newContract();
					}}
				>
					Deploy
				</div>
			</div>

			<div className="existing-contracts">
				<h1> Existing Contracts </h1>

				<ul id="container">
					{escrows.map((escrow, i) => (
						<li key={i}>
							<Escrow {...escrow} />
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default App;
