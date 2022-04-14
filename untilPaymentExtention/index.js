let useraddress;
let provider;
let signer;
let jpyccontract;
let shopwalletaddress;

window.onload = async function() {
    ethereum.on('chainChanged', (_chainId) => window.location.reload());
    //$('#wallet-popup').modal('show');
    //newTorus();
    //mainimage = document.getElementById("mainimage");
    //mainimage.src = image;
    changeToMatic();

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
    jpyccontract = await new ethers.Contract( jpyc_on_rinkeby , abi_JPYC, signer );
    balance = await jpyccontract.balanceOf(useraddress) * 10e-19;
    document.getElementById("message_box").innerHTML = document.getElementById("message_box").innerHTML + balance + "JPYC持っています";
}

let a;

async function TokenPayment(){
    shopwalletaddress = document.getElementById("walletaddress").value;
    pricing = document.getElementById("superchat_price").value;
    document.getElementById("message_box").innerHTML = "ボタンが押されました。お支払いを開始します";
    let options = { gasPrice: 10000000000 , gasLimit: 100000};
    const jpycprice = ethers.utils.parseUnits( pricing.toString() , 18);
    jpyccontract.transfer(  shopwalletaddress, jpycprice , options ).catch((error) => {
    a=error;
    document.getElementById("message_box").innerHTML = error.code + "<br>" + error.message + "<br>" + error.stack + "<br>" + error.data + "<br>" + JSON.stringify(error);
    });
}

async function changeToMatic(){
    document.getElementById("message_box").innerHTML = "Rinkeby Networkに切り替えましょう";
    let ethereum = window.ethereum;
        const data = [{
            chainId: '0x4',
        }]
    const tx = await ethereum.request({method: 'wallet_switchEthereumChain', params:data}).catch()
    document.getElementById("message_box").innerHTML = "準備ができました。お支払いボタンを押すと、お支払いできます<br><br>"
}

async function JPYCPayment(){
    const JPYCAddress = "0x7Bf4200567DC227B3db9c07c96106Ab5641Febb8" ;
    const JPYCContract = new ethers.Contract(JPYCAddress, abi_contract, signer);

    // 投げ銭のスマコン
    const youtuberaddress = document.getElementById("walletaddress").value;
    const jpycprice = document.getElementById("superchat_price").value;
    let options = { gasPrice: 10000000000 , gasLimit: 100000};
    // const jpycprice = ethers.utils.parseUnits( pricing.toString() , 18);
    // youtubermessage = document.getElementById("message").value; //ここは作る
    const youtubermessage  = "hello";
    const nickname = "hello";

    //イベント情報をフィルターして、Receiver に送る
    filter = JPYCContract.filters.MoneySent(null, null, null, null, null);
    JPYCContract.on(filter, (_senderAddr, _reciveAddr, _message, _alias, _amount) => {
                console.log(`I got ${ _amount } JPYC from ${ _alias } saying ${ _message }`);
    document.getElementById("message_box").innerHTML = "送信成功！"
        }); 
    

    filter = JPYCContract.filters.ErrorLog();
    JPYCContract.on(filter, (_message) => {
                console.log(`I got ${ _message }`);
    document.getElementById("message_box").innerHTML = "送信失敗！"
        }); 
    

    //SendJpyc
    JPYCContract.sendJpyc(  youtuberaddress, youtubermessage, nickname, jpycprice, options).catch((error) => {
    a=error;
    document.getElementById("message_box").innerHTML = error.code + "<br>" + error.message + "<br>" + error.stack + "<br>" + error.data + "<br>" + JSON.stringify(error);
    });
    console.log("成功！")


    
}

