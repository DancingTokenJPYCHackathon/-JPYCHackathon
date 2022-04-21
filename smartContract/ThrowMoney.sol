// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";

interface IThrowMoneyPool {
    function getname() external view returns (string memory);
    function getsymbol() external view returns (string memory);
    function jpycAmount() external view returns (uint);
    function approveJpycFromContract() external;
    function emitMoneySent(address _senderAddr,
                           string memory _message,
                           string memory _senderAlias,
                           uint _amount) external;
}

interface IThrowMoneyFactory {
    function getPool(address sender) external view returns(address);
    function newThrowMoneyPool() external returns(address);
}


// 投げ銭のスマコン
contract ThrowMoneyPool is IThrowMoneyPool {

    // 上で定義した ERC20 規格を呼び出すためのインタフェース
    IERC20 public jpyc;
    IThrowMoneyFactory public throwMoneyFactory;

    address senderPoolAddress;
    IThrowMoneyPool senderPool;

    address owner;

    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }
    
    constructor(address _sender, address _throwMoneyFactoryAddress) {
        owner = _sender;

        // Rinkeby Network の JPYC
        jpyc = IERC20(0xbD9c419003A36F187DAf1273FCe184e1341362C0);

        // ThrowMoneyFactory のインターフェース
        throwMoneyFactory = IThrowMoneyFactory(_throwMoneyFactoryAddress);
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

    function emitMoneySent(address _senderAddr,
                           string memory _message,
                           string memory _senderAlias,
                           uint _amount) public {
        emit MoneySent(_senderAddr, address(this), _message, _senderAlias, _amount);
    }

    // コントラストから配信者へ送金する関数
    function sendJpyc(address _reciveAddr,
                       string memory _message,
                       string memory _senderAlias,
                       uint _amount) public onlyOwner {

        // 送金者が Owner と一致している時のみ送金を許可
        require(owner == msg.sender, "You are not the owner of this pool.");

        // 送金額がプールされて金額以下となるようにチェック
        require(jpyc.balanceOf(address(this)) >= _amount, "Insuffucient balance on contract");

        // 送金に必要なデータが登録されているかをチェック
        require(bytes(_message).length != 0, "Need message to throw money");
        require(_amount != 0, "Need JPYC set to be greater than 0 to throw money");
        require(_reciveAddr != address(0), "Need to set reciver address to throw money");

        // プールからの送金を許可
        try jpyc.approve(address(this), _amount) {
            // プールからの送金成功時は何もしない
        } catch Error(string memory reason) {
            // プールからの送金許可失敗時にエラーを発出
            emit ErrorLog(reason);
        }

        // 配信者のプールのアドレスを取得
        senderPoolAddress = throwMoneyFactory.getPool(_reciveAddr);
        // 配信者のプールのインターフェースを作成
        senderPool = IThrowMoneyPool(senderPoolAddress);

        try jpyc.transferFrom(address(this), senderPoolAddress, _amount) {
            // 送金成功時にイベントを発出
            senderPool.emitMoneySent(owner, _message, _senderAlias, _amount);
        } catch Error(string memory reason) {
            // 送金失敗時にはエラーを発出
            emit ErrorLog(reason);
        }
        
    }
}

contract ThrowMoneyFactory is IThrowMoneyFactory {

    mapping(address => address) pools;

    // イベント
    event ErrorLog(string __error_message);
    event PoolCreated(address indexed __sender_address, address __pool_address);

    function getPool(address _sender) public view returns(address) {
        return pools[_sender];
    }

    function newThrowMoneyPool() public returns(address) {
        require(address(pools[msg.sender]) == address(0), "Pool already created for this wallet address");
        // 新しいプールを作成
        ThrowMoneyPool pool = new ThrowMoneyPool(msg.sender, address(this));
        emit PoolCreated(msg.sender, address(pool));

        pools[msg.sender] = address(pool);

        return pools[msg.sender];
    }
}
