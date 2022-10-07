// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./WannaKIP7.sol";
import "./klaytn-contracts/utils/math/SafeMath.sol";
import "./WannaFactory.sol";

contract WannaProject is WannaKIP7{
    using SafeMath for uint256;

    /*
        @dev this contract should be deployed by WannaFactory
        @dev mint, claim, refund function should be called from WannaRouter.
    */

    address public factory;
    string public title;
    uint256 public id;
    address payable public launcher;
    uint256 public started;
    uint256[] public dues; // as timestamp
    uint256[] public amounts; // unit: KLAY
    bool public funding_complete;

    // voting results
    // stage => votes
    mapping(uint256 => uint256) public pros;
    mapping(uint256 => uint256) public cons;

    
    mapping(uint256 => mapping(address => bool)) public voting_done;

    uint256 private constant _DUE_TERM = 1209600; // 2 weeks as timestamp
    uint256 private constant _FUNDING_PERIODS = 604800; // 1 week as timestamp
    uint256 private constant _VOTING_PERIODS = 259200; // 3 days as timestamp

    // received
    mapping(uint256 => bool) public claimed;

    // vote
    uint8 private constant _PRO = 0;
    uint8 private constant _CON = 1;

    // votingStatus
    uint8 private constant _NOT_VOTING = 0;
    uint8 private constant _VOTING = 1;
    uint8 private constant _FUNDING = 2;

    // voteResult
    uint8 private constant _VOTE_CONFIRMED = 0;
    uint8 private constant _VOTE_REJECTED = 1;
    uint8 private constant _VOTE_ING = 2;

    constructor() {
        factory = msg.sender;
    }

    receive() external payable {}
    
    uint8 private unlocked = 1;

    modifier lock() {
        require(unlocked == 1, 'WannaProject: LOCKED');
        unlocked = 0;
        _;
        unlocked = 1;
    }

    function totalAmounts() public view returns (uint256 _totalAmounts){
        for(uint256 i=0; i<amounts.length; i++){
            _totalAmounts = _totalAmounts.add(amounts[i]);
        }
    }

    // stage
    function stage() public view returns (uint256){
        for(uint256 i=0; i<dues.length; i++){
            if(pros[i]<cons[i]){
                return i;
            }

            if(i == (dues.length).sub(1)){
                return i;
            }

            if(dues[i] <= block.timestamp && block.timestamp < dues[i.add(1)]){
                return i;
            }
        }

        return dues.length;
    }

    function voteResult(uint256 _stage) public view returns (uint8 _result){
        if(_stage == stage() && votingStatus() == _VOTING){
            _result = _VOTE_ING;
        } else {
            if(pros[_stage]>cons[_stage]){
                _result = _VOTE_CONFIRMED;
            } else{
                _result = _VOTE_REJECTED;
            }
        }
    }

    // voting starts from dues[stage] to dues[stage] + _VOTING_PERIODS
    function votingStatus() public view returns (uint8 _votingStatus){
        if(started.add(_FUNDING_PERIODS) > block.timestamp){
            _votingStatus = _FUNDING;
        } else if(dues[stage()] <= block.timestamp && block.timestamp < dues[stage()].add(_VOTING_PERIODS)){
            _votingStatus = _VOTING;
        } else {
            _votingStatus = _NOT_VOTING;
        }
    }

    // cannot transfer while voting
    // it's for preventing duplicate votes
    function _transfer(address from, address to, uint value) virtual override internal {
        require(votingStatus()==_NOT_VOTING,'WannaProject: cannot transfer while voting');
        balanceOf[from] = balanceOf[from].sub(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(from, to, value);
    }

    // called once by the factory at time of deployment
    function initialize(string memory _title, uint256 _id, address payable _launcher, uint256[] memory _dues, uint256[] memory _amounts) external{
        require(msg.sender == factory,'WannaProject: only factory possible');
        
        // each element of dues should be incremental
        for(uint256 i = 0; i<_dues.length; i++){
            if(i != (_dues.length).sub(1)){
                require(_dues[i].add(_DUE_TERM) < _dues[i.add(1)]);
            }
        }

        title = _title;
        id = _id;
        launcher = _launcher;
        started = block.timestamp;
        dues = _dues;
        amounts = _amounts;
    }

    function mint(address to) external payable lock returns (uint256 _amount){
        require(votingStatus() == _FUNDING, 'WannaProject: not funding');
        require(msg.value.add(totalSupply) <= totalAmounts(), 'WnnaProject: funding complete');

        if(msg.value.add(totalSupply) == totalAmounts()){
            funding_complete = true;
        }

        _mint(to,msg.value);
        _amount = msg.value;
    }

    function claim(uint256 _stage, address payable to) external lock returns (uint256 _amount){
        require(to == launcher,'WannaProject: only launcher can');
        require(!claimed[_stage], 'WannaProject: already claimed');
        if(_stage == 0){
            require(funding_complete, 'WannaProject: funding not complete');
        } else {
            require(voteResult(_stage) == _VOTE_CONFIRMED, 'WannaProject: vote result not confirmed');
        }

        uint256 fee_amount = amounts[_stage].div(100);
        _amount = amounts[_stage].sub(fee_amount);

        to.transfer(amounts[_stage].sub(fee_amount));
        payable(factory).transfer(amounts[_stage].sub(fee_amount));

        claimed[_stage] = true;
    }

    function refund(address payable to, uint256 value) external lock returns (uint256 _amount){
        require(votingStatus() == _NOT_VOTING, 'WannaProject: voting not done');
        require(voteResult(stage()) == _VOTE_REJECTED, 'WannaProject: voting confirmed');

        if(stage() == 0){
            require(!funding_complete,'WannaProject: funding complete');
        }

        uint256 totalRefund;

        for(uint256 i = stage(); i < amounts.length; i++){
            totalRefund.add(amounts[i]);
        }
        
        _amount = value.mul(totalRefund).div(totalAmounts());

        _burn(address(to), value);
        to.transfer(_amount);
    }
    
    function vote(address from, uint8 _procon) external lock {
        require(votingStatus()==_VOTING,'WannaProject: not voting');
        require(balanceOf[from]>0,'WannaProject: not sponsor');
        require(_procon == _PRO || _procon == _CON, 'WannaProject: voting should be pro or con');
        require(!voting_done[stage()][from],'WannaProject: already voted');
        if(_procon == _PRO){
            pros[stage()] = pros[stage()].add(balanceOf[from]);
        } else if (_procon == _CON){
            cons[stage()] = cons[stage()].add(balanceOf[from]);
        }
    }
}