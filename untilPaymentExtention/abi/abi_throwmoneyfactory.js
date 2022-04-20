abi_throwmoneyfactory = [
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
				"internalType": "contract ThrowMoneyPool",
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
				"internalType": "contract ThrowMoneyPool",
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
				"internalType": "contract ThrowMoneyPool",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
