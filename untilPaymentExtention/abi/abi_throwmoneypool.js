abi_throwmoneypool = [
	{
		"inputs": [],
		"name": "approveJpycFromContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_senderAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_message",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_senderAlias",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "emitMoneySent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_reciveAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_message",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_senderAlias",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "sendJpyc",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_throwMoneyFactoryAddress",
				"type": "address"
			},
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
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "__senderAddr",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "__reciveAddr",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "__message",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "__alias",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "__amount",
				"type": "uint256"
			}
		],
		"name": "MoneySent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_jpycAmount",
				"type": "uint256"
			}
		],
		"name": "submitWithdrawRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "__txId",
				"type": "uint256"
			}
		],
		"name": "withdrawRequestId",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getname",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getsymbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "jpyc",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "jpycAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "throwMoneyFactory",
		"outputs": [
			{
				"internalType": "contract IThrowMoneyFactory",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawConfirmationAuthority",
		"outputs": [
			{
				"internalType": "contract IWithdrawConfirmationAuthority",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
