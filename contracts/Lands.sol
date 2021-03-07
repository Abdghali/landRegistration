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
        landsOwners[0]=landOwner(0,0xEb4E61F21c99015AB015D81B9eA06B9E66E3e907,"Ahmad Shaath");
        landsOwners[1]=landOwner(1,0x63f9Da71407F3dfd337b645551a980d45E882742,"Abdul Mohsen ");
        landsOwners[2]=landOwner(2,0x40837cf2f919Ad1E6Ce1c3340B7C2Fb1284495CC,"Manar Abu El khair ");
        landsOwners[3]=landOwner(3,0x5F4f94e8733F81b0D62EB6dE672AAaC579b47840,"Rola Abdel Wahhab");
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
