let useraddress;
let provider;
let signer;
let tmcontract;

window.onload = async function() {
    if (window.ethereum) {
      startup();
    } else {
      window.addEventListener('ethereum#initialized', handleEthereum, {
        once: true,
    });

    // If the event is not dispatched by the end of the timeout,
    // the user probably doesn't have MetaMask installed.
    setTimeout(handleEthereum, 3000); // 3 seconds
}
}

async function startup() {
    ethereum.on('chainChanged', (_chainId) => window.location.reload());
    changeToRinkeby();

    initmetamask();
}

/**
// 送金額に応じてスタイルシートを返す関数
function addStyleFromAmount(_amount, messageId){
    	const chatStyleSheet = "";

	if (_amount) {
		// 送金額に応じて異なるチャットボックスのスタイルシートを決定
	} else {
		// 送金額に応じて異なるチャットボックスのスタイルシートを決定
	}

	return chatStyleSheet;
}
**/

async function initmetamask(){
    if (window.ethereum !== undefined){
        document.getElementById("message_box").innerHTML = "MetaMask Mobileに接続しました!!";
    } else {
        document.getElementById("message_box").innerHTML = "MetaMask Mobileでこのページを開いてください";        
    }
    provider = await new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    useraddress = await signer.getAddress();    
    tmcontract = await new ethers.Contract(throwMoneyContract, abi, signer);
    filter = tmcontract.filters.MoneySent(null, useraddress, null, null, null);
    chat_counter = 0;

    tmcontract.on(filter, (_senderAddr, _reciveAddr, _message, _alias, _amount) => {
	    const messageId =  `chat_message_ ${ chat_counter }`;
            //const chatStyleSheet = addStyleFromAmount(_amount, messageId);

	    const chat_message = document.createElement("div");
	    chat_message.setAttribute("id", "chat_message");
	    chat_message.setAttribute("class", messageId);
	    chat_message.innerHTML = _message;
	    document.getElementById("chat_box").appendChild(chat_message);

            console.log(`I got ${ _amount } JPYC from ${ _alias } saying ${ _message }`);
    });
}


async function changeToRinkeby(){
    document.getElementById("message_box").innerHTML = "Rinkeby Networkに切り替えましょう";
    let ethereum = window.ethereum;
        const data = [{
            chainId: '0x4',
        }]
    const tx = await ethereum.request({method: 'wallet_switchEthereumChain', params:data}).catch()
    document.getElementById("message_box").innerHTML = "ウォレットとの連携が完了しました。<br><br>"
}
