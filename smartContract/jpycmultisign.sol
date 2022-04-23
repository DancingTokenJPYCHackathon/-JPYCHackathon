// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./IERC20.sol";

interface jpycinterface {
    function getname() external view returns (string memory);
    function getsymbol() external view returns (string memory);
    function jpycAmount() external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint256);
}


contract jpycMultiSigWallet {
    IERC20 public jpyc;
    address extract_owner;
//event
    event Deposit(address indexed sender, uint amount, uint balance);
    event SubmitTransaction(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint jpyc_value,
        bytes data
    );
    //各項目ごとに txIndex 番号を付与
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);

//ownerアドレスをaddress形式で array配列保存
    address[] public owners;
//msg.sender = owner を素早く確認する方法。address -> bool形式 address, trueなら owner
    mapping(address => bool) public isOwner;
//approve の数を uint 形式で定義
    uint public numConfirmationsRequired;

//Transaction という構造体
    struct Transaction {
        //transaction が実行されるアドレス
        address to;
        //送られた ether
        uint jpyc_value;
        //その他 data   txを定義しているデータ（IDではなく、TXを定義づけているもの）
        bytes data;
        //tx is executed,　⇒"true"になる
        bool executed;
        uint numConfirmations;
    }
//tx毎のapproval/confirmed をmapping に保存。uint=tx 番号、address= owner adress bool = owner にapproveされたか否か
    mapping(uint => mapping(address => bool)) public isConfirmed;
//Transaction構造体を持つ transactions という名の array関数を宣言
    Transaction[] public transactions;
//msg.sender = contract ownerであることを確認。この処理は次のmodifierにいくまでに完了
    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }
    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }
    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }
    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }
//constructor
    constructor(address[] memory _owners, uint _numConfirmationsRequired) {
        jpyc = IERC20(0xbD9c419003A36F187DAf1273FCe184e1341362C0);
        extract_owner = msg.sender;

        //オーナーの数が1以上。もし違うとメッセージ。
        require(_owners.length > 0, "owners required");
        //承認の数は0以上、オーナーの数以下
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );

//owner ID を付与　 iはオーナーの数を越すまで IDが1ずつ増える
        for (uint i = 0; i < _owners.length; i++) {
            //owner = 指定されたowner ID 
            address owner = _owners[i];
            //オーナーは 0じゃない（存在する）
            require(owner != address(0), "invalid owner");
            //オーナーはユニークである。isOwnerと被らない
            require(!isOwner[owner], "owner not unique");
            //ここまで確認したら isOwner Mapping/DB に追加
            isOwner[owner] = true;
            //ownersの一覧のケツにownerを追加
            owners.push(owner);
        }
        numConfirmationsRequired = _numConfirmationsRequired;
    }
//wallet にETHを受け付けるようにする
    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

//FUNCTIONS
    function submitTransaction(
        address _to,
        uint _jpyc_value,
        bytes memory _data
        //owner のみsubmitできる
    ) public onlyOwner {
        uint txIndex = transactions.length;
    //Transactions array に入れ込む
        transactions.push(
            Transaction({
                to: _to,
                jpyc_value: _jpyc_value,
                data: _data,
                executed: false,
                numConfirmations: 0
            })
        );
        emit SubmitTransaction(msg.sender, txIndex, _to, _jpyc_value, _data);
    }
    function confirmTransaction(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        //approavalをmappingに保存 ID > Address > Boolean
        isConfirmed[_txIndex][msg.sender] = true;
        emit ConfirmTransaction(msg.sender, _txIndex);
    }
    function executeTransaction(uint _txIndex)
        payable
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        //?? storageに保存する transaction関数 = transactionsの ID番目
        Transaction storage transaction = transactions[_txIndex];
        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );
    //transaction 変数が trueになる
        // bool success;
        transaction.executed = true;

        require(jpyc.balanceOf(address(this)) >= transaction.jpyc_value, "balance insufficent");

    //transaction の toに規定されたアドレスへ value を受け渡す  //callはETH専用なので、代わりにtransfer使う
        jpyc.transferFrom(address(this), transaction.to, transaction.jpyc_value);

        //successしてるか確かめる
        // require(success == true, "tx failed");
        emit ExecuteTransaction(msg.sender, _txIndex);
    }
    function revokeConfirmation(uint _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");
        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;
        emit RevokeConfirmation(msg.sender, _txIndex);
    }
    function getOwners() public view returns (address[] memory) {
        return owners;
    }
    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }
    function getTransaction(uint _txIndex)
        public
        view
        returns (
            address to,
            uint jpyc_value,
            bytes memory data,
            bool executed,
            uint numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];
        return (
            transaction.to,
            transaction.jpyc_value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }

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
    //貯金箱からの出金をする関数
   
       //貯金箱からの送金を許可する関数です
    function approveJpycFromContract() public {
        jpyc.approve( address(this) , jpyc.balanceOf(address(this)) );
    }


}
