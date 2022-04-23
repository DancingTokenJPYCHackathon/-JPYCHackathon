let useraddress;
let provider;
let signer;
let throwMoneyFactoryContract;

const throwMoneyFactoryAddress = "0x85841E40736Feb76de69DDA89e05760c4aB54E28";
const nullAddress = "0x0000000000000000000000000000000000000000";

window.onload = async function() {
      startup();
}

async function startup() {
    ethereum.on('chainChanged', (_chainId) => window.location.reload());
    ethereum.on('accountsChanged', () => window.location.reload());
    changeToRinkeby();

    initmetamask();
}

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

    throwMoneyFactoryContract = await new ethers.Contract(throwMoneyFactoryAddress, abi_ThrowMoneyFactory, signer);

    signerPool = await throwMoneyFactoryContract.getPool(useraddress);
    if (signerPool === nullAddress) {
        document.getElementById("OSH-pool-button").textContent = "Poolを作成";
        document.getElementById("OSH-pool-button").setAttribute("onclick", "createPool()");
        document.getElementById("message-box").innerHTML = `${ useraddress } の プールを作成してください！`;
        document.getElementById("OSH-pool-button").style.cssText = 'visibility: visible';
    } else {
        document.getElementById("OSH-pool-button").setAttribute("onclick", "")
        document.getElementById("OSH-pool-button").style.cssText += 'visibility: hidden';
        document.getElementById("message-box").textContent = `${ useraddress } の Pool は既に作成されています`;
    };
    
}

//Pool作成
async function createPool(){
    filter = throwMoneyFactoryContract.filters.PoolCreated(useraddress, null);
    throwMoneyFactoryContract.on(filter, (_signer_address, _pool_address) => {
        signerPool = _pool_address;
        console.log(signerPool);
        if (signerPool !== nullAddress) {
            document.getElementById("OSH-pool-button").textContent = "プールを作成しました！";
            document.getElementById("OSH-pool-button").setAttribute("onclick", "");
            document.getElementById("OSH-pool-button").style.cssText += 'visibility: hidden';
            document.getElementById("message-box").textContent = "プールを作成しました！" + "\n" + `作成したプールの Address は ${ signerPool } です！` ;
        }
    });

    await throwMoneyFactoryContract.newThrowMoneyPool();
}

async function changeToRinkeby(){
    document.getElementById("message-box").innerHTML = "Rinkeby Networkに切り替えましょう";
    let ethereum = window.ethereum;
        const data = [{
            chainId: '0x4',
        }]
    const tx = await ethereum.request({method: 'wallet_switchEthereumChain', params:data}).catch()
    document.getElementById("message-box").innerHTML = "ウォレットとの連携が完了しました。<br><br>"
}
