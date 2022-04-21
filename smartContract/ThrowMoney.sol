// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

// 投げ銭のスマコン
contract ThrowMoneyPool {

    // 上で定義した ERC20 規格を呼び出すためのインタフェース
    IERC20 public jpyc;

    address owner;

    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }
    
    constructor(address _sender) {
        owner = _sender;

        // Rinkeby Network の JPYC
        jpyc = IERC20(0xbD9c419003A36F187DAf1273FCe184e1341362C0);
    }

    // イベント
    event ErrorLog(string __error_message);
    event MoneySent(address indexed __senderAddr, address indexed __reciveAddr, string __message, string __alias, uint __amount);


    // トークン名を確認する関数
    function getname() public view returns (string memory){
        return jpyc.name();
    }

    // シンボル (JPYC) を確認する関数
    function getsymbol() public view returns (string memory){
        return jpyc.symbol();
    }

    // プールに入っている金額を確認する関数
    function jpycAmount() public view returns (uint) {
        return jpyc.balanceOf(address(this)) / 10 ** 18;
    }

    // プールからの送金を許可する関数
    function approveJpycFromContract() public {
        jpyc.approve(address(this) , jpyc.balanceOf(address(this)) );
    }

    // コントラストから配信者へ送金する関数
    function sendJpyc(address _reciveAddr,
                       string memory _message,
                       string memory _senderAlias,
                       uint _amount) public onlyOwner {

        // 換算 (後ほど削除予定)
        uint _amount_wei = _amount * 10 ** 18;

        // 送金者が Owner と一致している時のみ送金を許可
        require(owner == msg.sender, "You are not the owner of this pool.");

        // 送金額がプールされて金額以下となるようにチェック
        require(jpyc.balanceOf(address(this)) >= _amount_wei, "Insuffucient balance on contract");

        // 送金に必要なデータが登録されているかをチェック
        require(bytes(_message).length != 0, "Need message to throw money");
        require(_amount != 0, "Need JPYC set to be greater than 0 to throw money");
        require(_reciveAddr != address(0), "Need to set reciver address to throw money");

        // プールからの送金を許可
        try jpyc.approve(address(this), _amount_wei) {
            // 何もしない
        } catch Error(string memory reason) {
            // プールからの送金許可失敗時にエラーを発出
            emit ErrorLog(reason);
        }

        try jpyc.transferFrom(address(this), _reciveAddr, _amount_wei) {
            // 送金成功時にイベントを発出
            emit MoneySent(owner, _reciveAddr, _message, _senderAlias, _amount);
        } catch Error(string memory reason) {
            // 送金失敗時にはエラーを発出
            emit ErrorLog(reason);
        }
        
    }
}