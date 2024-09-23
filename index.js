// Check if MetaMask is installed 
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    alert('Please install MetaMask!');
}

// Connect MetaMask function
async function connectMetaMask() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected', accounts[0]); // Print the user's first Ethereum account
        } catch (error) {
            console.error('User rejected the connection', error);
        }
    } else {
        alert('MetaMask is not installed. Please install it to use this DApp.');
    }
}

// Load when the page is loaded
window.onload = async () => {
    await connectMetaMask();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const abi = [ 
        // ABI as previously defined...
    ];

    // Contract address (replace with your deployed contract address)
    const contractAddress = '0x47ff060d6ac3D44121E79838Bd94c10a509460aa';

    // Create contract instance
    const lotteryContract = new ethers.Contract(contractAddress, abi, signer);

    // Display Manager
    const manager = await lotteryContract.manager();
    document.getElementById("manager").innerText = manager;

    // Display Contract Balance
    const balanceWei = await lotteryContract.getBalance();
    const balanceEth = ethers.utils.formatEther(balanceWei);
    document.getElementById("balance").innerText = balanceEth;

    // Function to fetch and display players
    async function displayPlayers() {
        try {
            const playerCount = await lotteryContract.players.length; // Ensure this is correct in your contract
            let playersList = '';
            for (let i = 0; i < playerCount; i++) {
                const player = await lotteryContract.players(i);
                playersList += `<li>${player}</li>`;
            }
            document.getElementById("players").innerHTML = playersList; // Display players
        } catch (error) {
            console.error("Error fetching players:", error);
        }
    }

    // Set Manager Address from Text Box
    document.getElementById("setManagerBtn").addEventListener("click", async () => {
        const managerAddress = document.getElementById("managerAddress").value;
        if (managerAddress) {
            try {
                const transaction = await lotteryContract.setManager(managerAddress);
                await transaction.wait();
                document.getElementById("manager").innerText = managerAddress;
                alert("Manager address set: " + managerAddress);
            } catch (error) {
                alert("Error setting manager: " + error.message);
            }
        } else {
            alert("Please enter a valid manager address.");
        }
    });

    // Participate in Lottery
    document.getElementById("participateBtn").addEventListener("click", async () => {
        try {
            const transaction = await lotteryContract.participate({ value: ethers.utils.parseEther("1") });
            await transaction.wait();
            alert("You have successfully participated in the lottery!");
            await displayPlayers(); // Refresh players list after participation
        } catch (error) {
            alert("Error participating in the lottery: " + error.message);
        }
    });

    // Pick Winner (Only manager can do this)
    document.getElementById("pickWinnerBtn").addEventListener("click", async () => {
        try {
            const transaction = await lotteryContract.pickWinner();
            await transaction.wait();
            const winner = await lotteryContract.winner();
            document.getElementById("winner").innerText = winner;
            alert("The winner is: " + winner);
        } catch (error) {
            alert("Error picking the winner: " + error.message);
        }
    });

    // Initial load of players
    await displayPlayers();
};
