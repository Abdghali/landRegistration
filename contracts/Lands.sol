// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Lands {
    struct land {
        address owner;
        string city;
        string town;
        string trough;
        string part;
        string contractHash;
    }
    struct landOwner{

        uint id; 
        address ownerAddress;
        string fullName ;
    }
    mapping (uint=>landOwner) public landsOwners;
    mapping(address => land) public landsByAddress;
    mapping(uint256 => land) public lands;
    uint256 public landsCounter;

    modifier isLandOwner(address _owner) {
        require(
            landsByAddress[_owner].owner == _owner,
            "The seller is not the real owner of the land"
        );

        _;
    }
    
    constructor() public {
        landsCounter = 0;
        landsOwners[0]=landOwner(0,0xEA3b0d98bD22Fd7Ee69d4b527B018988D89c723B,"Ahmad Shaath");
        landsOwners[1]=landOwner(1,0x198D90C1f9C1F8952B3BA90E86D9Ca2b22c1215f,"Abdul Mohsen ");
        landsOwners[2]=landOwner(2,0xC60D950464286720f0EA220304a93080b96a4A59,"Manar Abu El khair ");
        landsOwners[3]=landOwner(3,0x35bEBd9DCD066848B79365CEc726772F12310e91,"Rola Abdel Wahhab");
    }

  
    function moveOwnerShip(address _from, address _to)  public isLandOwner(_from){
        landsByAddress[_to] = land(
            _to, //landsByAddress[_from].owner// _owner,
            landsByAddress[_from].city,
            landsByAddress[_from].town,
            landsByAddress[_from].trough,
            landsByAddress[_from].part,
            landsByAddress[_from].contractHash
        );
        landsByAddress[_from]= land(_from,'','','','','');
    }

    function registerLand(
        address _owner,
        string memory _city,
        string memory _town,
        string memory _trough,
        string memory _part,
        string memory _contractHash
    ) public {
        landsCounter++;
        lands[landsCounter] = land(
            _owner,
            _city,
            _town,
            _trough,
            _part,
            _contractHash
        );
        landsByAddress[_owner] = land(
            _owner,
            _city,
            _town,
            _trough,
            _part,
            _contractHash
        );
    }

    function getContractByAddress(address _owner)
        public
        view
        returns (
            address,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        return (
            landsByAddress[_owner].owner,
            landsByAddress[_owner].city,
            landsByAddress[_owner].town,
            landsByAddress[_owner].trough,
            landsByAddress[_owner].part,
            landsByAddress[_owner].contractHash
        );
    }
}
