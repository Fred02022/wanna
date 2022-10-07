// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./WannaFactory.sol";
import "./WannaProject.sol";
import "./WannaKIP7.sol";
import "./WannaKIP17.sol";
import "./klaytn-contracts/utils/math/SafeMath.sol";

contract WannaRouter {

    address payable public factory;
    WannaKIP17 public nft;

    constructor(address payable _factory, WannaKIP17 _nft) {
        factory = _factory;
        nft = _nft;
    }
    
    receive() external payable {}

    function getProject (uint256 id) public view returns (address payable _project){
        _project = WannaFactory(factory).allProjects(id);
    }

    function sponse (uint256 id) payable public {
        require(address(getProject(id)) != address(0), 'WannaRouter: project not started yet');
        WannaProject(getProject(id)).mint{value:msg.value}(msg.sender);
        nft.mint(msg.sender,id);
    }

    function claim (uint256 id, uint256 stage) public {
        require(address(getProject(id)) != address(0), 'WannaRouter: project not started yet');
        WannaProject(getProject(id)).claim(stage, payable(msg.sender));
    }

    function refund (uint256 id, uint256 value) public {
        require(address(getProject(id)) != address(0), 'WannaRouter: project not started yet');
        WannaProject(getProject(id)).refund(payable(msg.sender),value);
    }

    function vote (uint256 id, uint8 procon) public {
        require(address(getProject(id)) != address(0), 'WannaRouter: project not started yet');
        WannaProject(getProject(id)).vote(msg.sender,procon);
    }
}