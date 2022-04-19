let useraddress;
let provider;
let signer;
let tmcontract;

window.onload = async function() {
      startup();
}

async function startup() {
    ethereum.on('chainChanged', (_chainId) => window.location.reload());
    changeToRinkeby();

    //initmetamask();
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
    document.getElementById("message_box").innerHTML = "配信開始しました！";
    //provider = await new ethers.providers.Web3Provider(window.ethereum);
    //await provider.send("eth_requestAccounts", []);
    //signer = await provider.getSigner();
    //useraddress = await signer.getAddress();    
    //useraddress = "0x7a6C738D8c6936A7b9EDcf11c3fF7284624AA876";
    const provider = await ethers.getDefaultProvider("rinkeby", {etherscan: "KAAQMZSEM8PAUDKX7BP26EAEM85A7SG5G6"});
    useraddress = document.getElementById("wallet_address_input").value;    
    tmcontract = await new ethers.Contract(throwMoneyContract, abi, provider);
    filter = tmcontract.filters.MoneySent(null, useraddress, null, null, null);
    chat_counter = 0;

    tmcontract.on(filter, (_senderAddr, _reciveAddr, _message, _alias, _amount) => {
	    const chatId =  `chat_message_${ chat_counter }`;
	    // 入金額によってスタイルを変更
            //const chatStyleSheet = addStyleFromAmount(_amount, messageId);
	    chat_counter += 1;

	    // #chat_box に追加する div 要素, スマコンからのイベントデータを入れる
	    const chat = document.createElement("div");
	    chat.setAttribute("id", "chat");
	    chat.setAttribute("class", chatId);

	    // ニックネームを入れる div
	    const chat_alias = document.createElement("div");
	    chat_alias.setAttribute("id", "chat_alias");
	    chat_alias.innerHTML = _alias;
	    chat.appendChild(chat_alias);

	    // 入金額を入れる div
	    const chat_amount = document.createElement("div");
	    chat_amount.setAttribute("id", "chat_amount");
	    chat_amount.innerHTML = _amount;
	    chat.appendChild(chat_amount);

	    // メッセージを入れる div
	    const chat_message = document.createElement("div");
	    chat_message.setAttribute("id", "chat_message");
	    chat_message.innerHTML = _message;
	    chat.appendChild(chat_message);

	    document.getElementById("chat_box").appendChild(chat);

	    // デバッグ用ログ
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
