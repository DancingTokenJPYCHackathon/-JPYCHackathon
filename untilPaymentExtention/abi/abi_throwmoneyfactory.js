abi_throwmoneyfactory = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_withdrawCAAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "__error_message",
				"type": "string"
			}
		],
		"name": "ErrorLog",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "newThrowMoneyPool",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "__sender_address",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "__pool_address",
				"type": "address"
			}
		],
		"name": "PoolCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_sender",
				"type": "address"
			}
		],
		"name": "getPool",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
