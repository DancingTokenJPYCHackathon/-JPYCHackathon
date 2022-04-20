pragma solidity ^0.8.0;

import "./ThrowMoney.sol";

contract ThrowMoneyFactory {

    mapping(address => ThrowMoneyPool) pools;

    // イベント
    event ErrorLog(string __error_message);
    event PoolCreated(ThrowMoneyPool __pool_address, uint __pool_balance);

    function getPool(address _sender) public view returns(ThrowMoneyPool) {
        return pools[_sender];
    }

    function newThrowMoneyPool() public returns(ThrowMoneyPool) {
        require(address(pools[msg.sender]) == address(0), "Pool already created for this wallet address");
        // 新しいプールを作成
        ThrowMoneyPool pool = new ThrowMoneyPool(msg.sender);
        emit PoolCreated(pool, pool.jpycAmount());

        pools[msg.sender] = pool;

        return pool;
    }
}