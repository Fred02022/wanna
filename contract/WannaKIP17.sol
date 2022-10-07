// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./klaytn-contracts/KIP/token/KIP17/extensions/KIP17Enumerable.sol";
import "./klaytn-contracts/KIP/token/KIP17/KIP17.sol";
import "./klaytn-contracts/access/Ownable.sol";
import "./klaytn-contracts/utils/math/SafeMath.sol";

contract WannaKIP17 is KIP17Enumerable, Ownable {
    using SafeMath for uint256;

    constructor (string memory name, string memory symbol) KIP17(name, symbol){}

    string public baseURI = "https://wannaproject.s3.ap-northeast-2.amazonaws.com/sponsor/meta/";
    string public baseURIBack = ".json";

    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "KIP17Metadata: URI query for nonexistent token"
        );

        string memory _baseURI = baseURI;
        string memory idstr;
        string memory _baseURIBack = baseURIBack;

        uint256 temp = tokenId;
        idstr = uint2str(temp);

        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(_baseURI, idstr, _baseURIBack))
                : "";
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function setBaseURIBack(string memory _baseURIBack) public onlyOwner {
        baseURIBack = _baseURIBack;
    }

    mapping(address => bool) public minter;
    mapping(uint256 => uint256) public project_id; // token id => project_id

    function setMinter(address _minter) public onlyOwner {
        minter[_minter] = true;
    }

    uint256 nowNum;
    
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        require(2<1,'cannot transfer');
        emit Transfer(from, to, tokenId);
    }

    function mint(address to, uint256 _project_id) public {
        require(minter[address(msg.sender)], 'WannaKIP17: not minter');
        _mint(to, nowNum);
        project_id[nowNum] = _project_id;
        nowNum = nowNum.add(1);
    }
}