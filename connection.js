async function connectMetaMask() { 
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        try {
            // Request account access
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                console.log('Connected:', accounts[0]); // Print the user's first Ethereum account
                return accounts[0];
            } else {
                console.warn('No accounts found. Please ensure your MetaMask is set up correctly.');
                alert("No accounts found. Please check your MetaMask setup.");
            }
        } catch (error) {
            console.error('User rejected the connection:', error);
            alert("User rejected the connection. Please check MetaMask.");
        }
    } else {
        console.error('MetaMask is not installed.');
        alert('MetaMask is not installed. Please install it to use this DApp.');
    }
}
