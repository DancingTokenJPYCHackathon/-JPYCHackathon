let useraddress;
let provider;
let signer;
let JPYCContract;
let throwMoneyFactoryContract;
let signerPool;

const jpyc_on_rinkeby = "0xbD9c419003A36F187DAf1273FCe184e1341362C0";
const nullAddress = "0x0000000000000000000000000000000000000000";
//const throwMoneyFactoryAddress = "0xceb79363b0125819e172408376ea4Fad65c1ecb2";
const throwMoneyFactoryAddress = "0x85841E40736Feb76de69DDA89e05760c4aB54E28";
const JPYCAddress = "0x7Bf4200567DC227B3db9c07c96106Ab5641Febb8";


window.onload = async function() {
    ethereum.on('chainChanged', (_chainId) => window.location.reload());
    changeToMatic();
    initmetamask();
}

//metamask 呼び出し
async function initmetamask(){
    if (window.ethereum !== undefined){
        document.getElementById("message-box").innerHTML = "MetaMask に接続しました";
    } else {
        document.getElementById("message-box").innerHTML = "MetaMask でこのページを開いてください";        
    }
    provider = await new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    useraddress = await signer.getAddress();    
    JPYCContract = await new ethers.Contract(jpyc_on_rinkeby , abi_JPYC, signer );
    balance = await JPYCContract.balanceOf(useraddress) * 10e-19;
    document.getElementById("message-box").innerHTML = document.getElementById("message-box").innerHTML + balance + "JPYC持っています";
    
    throwMoneyFactoryContract = new ethers.Contract(throwMoneyFactoryAddress, abi_throwmoneyfactory, signer);
    signerPool = await throwMoneyFactoryContract.getPool(await signer.getAddress());
    if (signerPool === nullAddress) {
        document.getElementById("OSH-pool-button").textContent = "Poolを作成";
        document.getElementById("OSH-pool-button").setAttribute("onclick", "createPool()");
    };
}

let a;

//Pool作成
async function createPool(){
    filter = throwMoneyFactoryContract.filters.PoolCreated(useraddress, null);
    throwMoneyFactoryContract.on(filter, (_signer_address, _pool_address) => {
        signerPool = _pool_address;
        console.log(signerPool);
        if (signerPool !== nullAddress) {
            document.getElementById("OSH-pool-button").textContent = "入金する";
            document.getElementById("OSH-pool-button").setAttribute("onclick", "JPYCPool()");
        }
    });

    throwMoneyFactoryContract.newThrowMoneyPool();
}


//RinkebyNetworkへ切り替え
async function changeToMatic(){
    document.getElementById("message-box").innerHTML = "Rinkeby Networkに切り替えましょう";
    let ethereum = window.ethereum;
        const data = [{
            chainId: '0x4',
        }]
    const tx = await ethereum.request({method: 'wallet_switchEthereumChain', params:data}).catch()
    document.getElementById("message-box").innerHTML = "準備ができました。<br><br>"
}


//Poolへの入金動作    
async function JPYCPool(){    
    PoolContract = new ethers.Contract(signerPool, abi_contract, signer);

    poolAmountEther = document.getElementById("OSH-pool-amount").value;
    const poolAmountWei = ethers.utils.parseUnits(poolAmountEther.toString(), 18);
    let options = { gasPrice: 10000000000 , gasLimit: 100000};
    
    JPYCContract.transfer(signerPool, poolAmountWei, options).catch((error) => {
            a=error;
            document.getElementById("message-box").innerHTML = error.code + "<br>" + error.message + "<br>" + error.stack + "<br>" + error.data + "<br>" + JSON.stringify(error);
            });
    // Update pool amount on DOM
};

//入金ボタンを推した時に発生する動作

  

// //Poolからの出金 未展開
// async function extractPool(){    
//     Pool2Address = "0x7Bf4200567DC227B3db9c07c96106Ab5641Febb8" ;
//     Pool2Contract = new ethers.Contract(Pool2Address, abi_contract, signer);
//     pricing2 = document.getElementById("superchat_price").value;
//     const poolprice2 = ethers.utils.parseUnits( pricing2.toString() , 18);
//     let options = { gasPrice: 10000000000 , gasLimit: 100000};
    
//     JPYCContract.transfer(  Pool2Address, poolprice2 , options ).catch((error) => {
//             a=error;
//             document.getElementById("message-box").innerHTML = error.code + "<br>" + error.message + "<br>" + error.stack + "<br>" + error.data + "<br>" + JSON.stringify(error);
//             });
//     };




async function JPYCPayment(){
    PoolContract = new ethers.Contract(signerPool, abi_contract, signer);

    // 投げ銭のスマコン
    const streamerAddress = document.getElementById("OSH-wallet-address").value;
    const amountWei = ethers.utils.parseUnits(document.getElementById("OSH-throw-amount").value.toString(), 18);
    let options = { gasPrice: 1000000 , gasLimit: 100000};
 
    const message  = document.getElementById("OSH-throw-message").value;
    const nickname = document.getElementById("OSH-nickname").value;

    //イベント情報をフィルターして、Receiver に送る
    filter = PoolContract.filters.MoneySent(null, null, null, null, null);
    PoolContract.on(filter, (_senderAddr, _reciveAddr, _message, _alias, _amountWei) => {
            console.log(`I got ${ ethers.utils.formatEther(_amountWei) } JPYC from ${ _alias } saying ${ _message }`);
            document.getElementById("message-box").innerHTML = "送信成功！";
        }); 

    filter = PoolContract.filters.ErrorLog();
    PoolContract.on(filter, (_message) => {
                console.log(`I got ${ _message }`);
                document.getElementById("message-box").innerHTML = "送信失敗！";
        }); 
    

    //SendJpyc
    PoolContract.sendJpyc(streamerAddress, message, nickname, amountWei, options).catch((error) => {
        a=error;
        document.getElementById("message-box").innerHTML = error.code + "<br>" + error.message + "<br>" + error.stack + "<br>" + error.data + "<br>" + JSON.stringify(error);
    });
    console.log("成功！")
}
