let useraddress;
let provider;
let signer;
let JPYCContract;
let throwMoneyFactoryContract;
let signerPool;

const jpyc_on_rinkeby = "0xbD9c419003A36F187DAf1273FCe184e1341362C0";
const nullAddress = "0x0000000000000000000000000000000000000000";
//const throwMoneyFactoryAddress = "0x0Dfd08e486EB61EB76A3015EF77B6a9Ec220AA9E";
const throwMoneyFactoryAddress = "0xceb79363b0125819e172408376ea4Fad65c1ecb2";
const JPYCAddress = "0x7Bf4200567DC227B3db9c07c96106Ab5641Febb8";


window.onload = async function() {
    ethereum.on('chainChanged', (_chainId) => window.location.reload());
    changeToMatic();
    initmetamask();
}

//metamask 呼び出し
async function initmetamask(){
    if (window.ethereum !== undefined){
        document.getElementById("message_box").innerHTML = "MetaMask に接続しました";
    } else {
        document.getElementById("message_box").innerHTML = "MetaMask でこのページを開いてください";        
    }
    provider = await new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    useraddress = await signer.getAddress();    
    JPYCContract = await new ethers.Contract( jpyc_on_rinkeby , abi_JPYC, signer );
    balance = await JPYCContract.balanceOf(useraddress) * 10e-19;
    document.getElementById("message_box").innerHTML = document.getElementById("message_box").innerHTML + balance + "JPYC持っています";
    
    throwMoneyFactoryContract = new ethers.Contract(throwMoneyFactoryAddress, abi_throwmoneyfactory, signer);
    signerPool = await throwMoneyFactoryContract.getPool(await signer.getAddress());
    if (signerPool === nullAddress) {
        document.getElementById("pool_button").textContent = "Poolを作成";
        document.getElementById("pool_button").setAttribute("onclick", "createPool()");
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
            document.getElementById("pool_button").textContent = "入金する";
            document.getElementById("pool_button").setAttribute("onclick", "JPYCPool()");
        }
    });

    throwMoneyFactoryContract.newThrowMoneyPool();
}


//RinkebyNetworkへ切り替え
async function changeToMatic(){
    document.getElementById("message_box").innerHTML = "Rinkeby Networkに切り替えましょう";
    let ethereum = window.ethereum;
        const data = [{
            chainId: '0x4',
        }]
    const tx = await ethereum.request({method: 'wallet_switchEthereumChain', params:data}).catch()
    document.getElementById("message_box").innerHTML = "準備ができました。<br><br>"
}


//Poolへの入金動作    
async function JPYCPool(PoolAddress){    
    PoolContract = new ethers.Contract(PoolAddress, abi_contract, signer);

    pricing = document.getElementById("superchat_price").value;
    const poolprice = ethers.utils.parseUnits( pricing.toString() , 18);
    let options = { gasPrice: 10000000000 , gasLimit: 100000};
    
    JPYCContract.transfer(PoolAddress, poolprice, options ).catch((error) => {
            a=error;
            document.getElementById("message_box").innerHTML = error.code + "<br>" + error.message + "<br>" + error.stack + "<br>" + error.data + "<br>" + JSON.stringify(error);
            });
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
//             document.getElementById("message_box").innerHTML = error.code + "<br>" + error.message + "<br>" + error.stack + "<br>" + error.data + "<br>" + JSON.stringify(error);
//             });
//     };




async function JPYCPayment(){
    JPYCContract = new ethers.Contract(JPYCAddress, abi_contract, signer);

    // 投げ銭のスマコン
    const streamerAddress = document.getElementById("walletaddress").value;
    const amount = document.getElementById("superchat_price").value;
    let options = { gasPrice: 10000000000 , gasLimit: 100000};
 
    const message  = document.getElementById("superchat_message").value;
    const nickname = document.getElementById("nickname").value;

    //イベント情報をフィルターして、Receiver に送る
    filter = JPYCContract.filters.MoneySent(null, null, null, null, null);
    JPYCContract.on(filter, (_senderAddr, _reciveAddr, _message, _alias, _amount) => {
            console.log(`I got ${ _amount } JPYC from ${ _alias } saying ${ _message }`);
            document.getElementById("message_box").innerHTML = "送信成功！";
        }); 

    filter = JPYCContract.filters.ErrorLog();
    JPYCContract.on(filter, (_message) => {
                console.log(`I got ${ _message }`);
                document.getElementById("message_box").innerHTML = "送信失敗！";
        }); 
    

    //SendJpyc
    JPYCContract.sendJpyc(streamerAddress, message, nickname, amount, options).catch((error) => {
        a=error;
        document.getElementById("message_box").innerHTML = error.code + "<br>" + error.message + "<br>" + error.stack + "<br>" + error.data + "<br>" + JSON.stringify(error);
    });
    console.log("成功！")
}
