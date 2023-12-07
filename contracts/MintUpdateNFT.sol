// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <=0.8.23;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MintUpdateNFT is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    OwnableUpgradeable
{
    uint256 private _nextTokenId;
    uint256 public maxSupply;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(uint256 _maxSupply) {
        // _disableInitializers();
        maxSupply = _maxSupply;
        require(
            maxSupply >= 1,
            "Max number of Update File NFTs must be greater than 0"
        ); // throws error if max supply is set to 0
        require(
            maxSupply < 6,
            "Max number of Update File NFTs must be less than or equal to 5"
        ); // throws error if max supply is set to a number greater than 5
    }

    function initialize(address initialOwner) public initializer {
        __ERC721_init("Update File", "UF");
        __ERC721Enumerable_init();
        __Ownable_init(initialOwner);
    }

    function safeMint(address to) public {
        uint256 tokenId = _nextTokenId++;
        require(
            tokenId <= (maxSupply - 1),
            "Max number of Update File NFTs minted"
        ); // checks if the number of minted nfts have surpassed the max supply we set earlier
        _safeMint(to, tokenId); // mints NFT to owners address and sets it to specific tokenId
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
