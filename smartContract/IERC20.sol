// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


//ERC20規格を読み込むための準備
interface IERC20 {
    //標準的なインタフェース
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    // 追加で呼び出したい関数を指定
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
}