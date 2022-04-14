let useraddress;
let provider;
let signer;
let tmcontract;

window.onload = async function() {
    ethereum.on('chainChanged', (_chainId) => window.location.reload());
    changeToRinkeby();

    initmetamask();

}


async function initmetamask(){
    if (window.ethereum !== undefined){
        document.getElementById("message_box").innerHTML = "MetaMask Mobileに接続しました";
    } else {
        document.getElementById("message_box").innerHTML = "MetaMask Mobileでこのページを開いてください";        
    }
    provider = await new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    useraddress = await signer.getAddress();    
    tmcontract = await new ethers.Contract(throwMoneyContract, abi, signer);
    filter = tmcontract.filters.MoneySent(null, useraddress, null, null, null);
    tmcontract.on(filter, (_senderAddr, _reciveAddr, _message, _alias, _amount) => {
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
    document.getElementById("message_box").innerHTML = "準備ができました。お支払いボタンを押すと、お支払いできます<br><br>"
}
