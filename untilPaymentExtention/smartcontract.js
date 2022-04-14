
//JPYCへの接続

//Rinkbye Network へ接続
// const JPYCAddress = "0xbD9c419003A36F187DAf1273FCe184e1341362C0" ;

// // The Contract object
// const JPYCContract = new ethers.Contract(JPYCAddress, abi_contract, provider);


// // 投げ銭のスマコン
// async function JPYCPayment(){
//     youtuberaddress = document.getElementById("walletaddress").value;
//     pricing = document.getElementById("price").value;
//     let options = { gasPrice: 10000000000 , gasLimit: 100000};
//     const jpycprice = ethers.utils.parseUnits( pricing.toString() , 18);
//     // youtubermessage = document.getElementById("message").value; //ここは作る
//     youtubermessage  = "hello";
//     nickname = "hello";


//     //provider 情報（アドレス、Wallet）を取得
//     signer = await provider.getSigner();
//     useraddress = await signer.getAddress();  

//     //SendJpyc
//     jpyccontract.sendJpyc(  youtuberaddress, youtubermessage, nickname, jpycprice).catch((error) => {
//     a=error;
//     document.getElementById("message_box").innerHTML = error.code + "<br>" + error.message + "<br>" + error.stack + "<br>" + error.data + "<br>" + JSON.stringify(error);
//     });

//     //イベント情報をフィルターして、Receiver に送る
//     filter = JPYCContract.filters.MoneySent(useraddress, null, null, null, null);
//     JPYCContract.on(filter, (_senderAddr, _reciveAddr, _message, _alias, _amount) => {
//                 console.log(`I got ${ _amount } JPYC from ${ _alias } saying ${ _message }`);
//     document.getElementById("message_box").innerHTML = "送信成功！"
//         }); 

    
// }

