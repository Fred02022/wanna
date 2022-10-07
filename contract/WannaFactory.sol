// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./klaytn-contracts/utils/math/SafeMath.sol";
import "./WannaProject.sol";
import "./WannaKIP17.sol";
import "./klaytn-contracts/access/Ownable.sol";

contract WannaFactory is Ownable {
    using SafeMath for uint256;

    WannaKIP17 public nft;

    struct ProjectInfo {
        uint256 id;
        address payable launcher;
        uint256 started;
        string title;
        uint256[] dues;
        uint256[] amounts;
    }

    address payable [] public allProjects;
    mapping(address => ProjectInfo) private projectInfos;

    event ProjectCreated(address payable indexed launcher, address project, string title,uint256 id);
    event FeeReceived(address, uint);
    

    constructor(WannaKIP17 _nft) {
        nft = _nft;
    }

    receive() external payable {
        emit FeeReceived(msg.sender, msg.value);
    }

    function allProjectLength() external view returns (uint256) {
        return allProjects.length;
    }

    function getProjectInfo(address project_address) external view returns(ProjectInfo memory){
        return projectInfos[project_address];
    }

    function createProject(string memory _title, uint256[] memory _dues,uint256[] memory _amounts) external returns (address) {
        require(_dues.length == _amounts.length,'WannaFactory: dues and amounts not matched.');

        // the first element of dues should be replaced to started(block.timestamp)
        uint256[] memory __dues = _dues;
        __dues[0] = block.timestamp;

        uint256 id = allProjects.length;

        bytes32 _salt = bytes32(id);
        address payable project = payable(new WannaProject{salt: _salt}());

        WannaProject(project).initialize(_title, id, payable(msg.sender), _dues, _amounts);
        nft.mint(msg.sender,id);

        projectInfos[project] = ProjectInfo({
                id:id,
                launcher:payable(msg.sender),
                started:block.timestamp,
                title:_title,
                dues:_dues,
                amounts: _amounts
            });
            
        allProjects.push(project);
        emit ProjectCreated(payable(msg.sender), project, _title, id);

        return project;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}
