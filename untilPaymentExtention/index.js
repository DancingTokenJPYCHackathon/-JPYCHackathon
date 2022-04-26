let useraddress;
let provider;
let signer;
let JPYCContract;
let throwMoneyFactoryContract;
let signerPool;
let errorMessage;

const jpyc_on_rinkeby = "0xbD9c419003A36F187DAf1273FCe184e1341362C0";
const nullAddress = "0x0000000000000000000000000000000000000000";
const throwMoneyFactoryAddress = "0x6d837f431d7592F36e4b3146256eB301D017af4a";
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

    // ウオレットの残高を取得
    wallet_balance = Math.round(ethers.utils.formatEther(await JPYCContract.balanceOf(useraddress)));
    document.getElementById("wallet_balance").innerHTML = wallet_balance + " JPYC";

    // プールからの送金を監視
    _filter = JPYCContract.filters.Transfer(useraddress, null, null);
    JPYCContract.on(filter, async () => {
        _wallet_balance = Math.round(ethers.utils.formatEther(await JPYCContract.balanceOf(useraddress)));
        document.getElementById("wallet_balance").innerHTML = _wallet_balance + " JPYC"; 
    });

    // プールへの送金を監視
    _filter = JPYCContract.filters.Transfer(null, useraddress, null);
    JPYCContract.on(filter, async () => {
        _wallet_balance = Math.round(ethers.utils.formatEther(await JPYCContract.balanceOf(useraddress)));
        document.getElementById("wallet_balance").innerHTML = _wallet_balance + " JPYC"; 
    });

    
    throwMoneyFactoryContract = new ethers.Contract(throwMoneyFactoryAddress, abi_throwmoneyfactory, signer);
    signerPool = await throwMoneyFactoryContract.getPool(await signer.getAddress());

    if (signerPool === nullAddress) {
        document.getElementById("OSH-pool-button").textContent = "Poolを作成";
        document.getElementById("OSH-pool-button").setAttribute("onclick", "createPool()");
    } else {
        pool_balance = Math.round(ethers.utils.formatEther(await JPYCContract.balanceOf(signerPool)));
        document.getElementById("pool_balance").innerHTML = pool_balance + " JPYC";

        // プールからの送金を監視
        filter = JPYCContract.filters.Transfer(signerPool, null, null);
        JPYCContract.on(filter, async () => {
            pool_balance = Math.round(ethers.utils.formatEther(await JPYCContract.balanceOf(signerPool)));
            document.getElementById("pool_balance").innerHTML = pool_balance + " JPYC"; 
        });

        // プールへの送金を監視
        filter = JPYCContract.filters.Transfer(null, signerPool, null);
        JPYCContract.on(filter, async () => {
            pool_balance = Math.round(ethers.utils.formatEther(await JPYCContract.balanceOf(signerPool)));
            document.getElementById("pool_balance").innerHTML = pool_balance + " JPYC"; 
        });
    };
}


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

        // プールからの送金を監視
        _filter = JPYCContract.filters.Transfer(signerPool, null, null);
        JPYCContract.on(filter, async () => {
            pool_balance = Math.round(ethers.utils.formatEther(await JPYCContract.balanceOf(signerPool)));
            document.getElementById("pool_balance").innerHTML = pool_balance + " JPYC"; 
        });

        // プールへの送金を監視
        _filter = JPYCContract.filters.Transfer(null, signerPool, null);
        JPYCContract.on(filter, async () => {
            pool_balance = Math.round(ethers.utils.formatEther(await JPYCContract.balanceOf(signerPool)));
            document.getElementById("pool_balance").innerHTML = pool_balance + " JPYC"; 
        });
    });

    throwMoneyFactoryContract.newThrowMoneyPool();
}


//RinkebyNetworkへ切り替え
async function changeToMatic(){
    document.getElementById("message-box").innerHTML = "Rinkeby Network に切り替えましょう";
    let ethereum = window.ethereum;
        const data = [{
            chainId: '0x4',
        }]
    const tx = await ethereum.request({method: 'wallet_switchEthereumChain', params:data}).catch()
    document.getElementById("message-box").innerHTML = "Rinkeby Network に接続しました。<br><br>"
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

    /**
    //POOL残高表示
    filter = JPYCContract.filters.Transfer(signerPool, null, null);
    JPYCContract.on(filter, async () => {
        pool_balance = Math.round(ethers.utils.formatEther(await JPYCContract.balanceOf(signerPool)));
        // pool_balance = await JPYCContract.balanceOf(signerPool) * 10e-19 ;
        document.getElementById("pool_balance").innerHTML = pool_balance + " JPYC"    
    });

    filter = JPYCContract.filters.Transfer(null, signerPool, null);
    JPYCContract.on(filter, async () => {
        pool_balance = Math.round(ethers.utils.formatEther(await JPYCContract.balanceOf(signerPool)));
        document.getElementById("pool_balance").innerHTML = pool_balance + " JPYC" 
    });
    **/
    
    //Wallet残高表示
    wallet_balance = Math.round(ethers.utils.formatEther(await JPYCContract.balanceOf(useraddress)));
    document.getElementById("wallet_balance").innerHTML = wallet_balance + " JPYC";
};

  

//Poolからの出金 未展開
async function extractPool(){    
    PoolContract = new ethers.Contract(signerPool, abi_contract, signer);

    // 入力値の取得
    OSH_throw_amountEther = document.getElementById("OSH-pool-amount").value;
    OSH_throw_amountWei = ethers.utils.parseUnits(OSH_throw_amountEther.toString(), 18);

    // 送金処理の申請
    let option = {gasPrice: 10000000000 , gasLimit: 1000000}; // 想定よりガス代が高かった
    await PoolContract.submitWithdrawRequest(OSH_throw_amountWei, option);
    //出金額を approval 済み

    /** 個々は別のページで実行する (まだ削除しないで！)
    //承諾を得る 
    await multisignContract.confirmTransaction(txID);
    //(なんらかの実装で owner から承諾を得る)
    //実行
    await multisignContract.executeTransation(txID);
    **/
};



async function JPYCPayment(){
    PoolContract = new ethers.Contract(signerPool, abi_contract, signer);

    // 投げ銭のスマコン
    const streamerAddress = document.getElementById("OSH-wallet-address").value;
    let amountWei = ethers.utils.parseUnits(document.getElementById("OSH-throw-amount").value.toString(), 18);
    let options = { gasPrice: 10000000000, gasLimit: 1000000};
 
    let message  = document.getElementById("OSH-throw-message").value;
    let nickname = document.getElementById("OSH-nickname").value;

    //イベント情報をフィルターして、Receiver に送る
    filter = PoolContract.filters.MoneySent(useraddress, streamerAddress, null, null, null);
    PoolContract.on(filter, (_senderAddr, _reciveAddr, _message, _alias, _amountWei) => {
            console.log(`I got ${ ethers.utils.formatEther(_amountWei) } JPYC from ${ _alias } saying ${ _message }`);
        }); 

    filter = PoolContract.filters.ErrorLog();
    PoolContract.on(filter, (_message) => {
                console.log(`I got ${ _message }`);
                document.getElementById("message-box").innerHTML = "送信失敗！";
        }); 

    /**
        // プールからの送金を監視
        filter = JPYCContract.filters.Transfer(signerPool, null, null);
        JPYCContract.on(filter, async () => {
            pool_balance = Math.round(ethers.utils.formatEther(await JPYCContract.balanceOf(signerPool)));
            document.getElementById("pool_balance").innerHTML = pool_balance + " JPYC"; 
        });
    **/

    //SendJpyc
    PoolContract.sendJpyc(streamerAddress, message, nickname, amountWei, options).catch((error) => {
        errorMessage = error;
        //document.getElementById("message-box").innerHTML = error.code + "<br>" + error.message + "<br>" + error.stack + "<br>" + error.data + "<br>" + JSON.stringify(error);
    });
}
