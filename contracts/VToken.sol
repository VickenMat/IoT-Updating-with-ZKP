// SPDX-License-Identifier: MIT

pragma solidity >=0.8.19 <=0.8.23;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract VToken is ERC20, ERC20Permit, ERC20Burnable {
    // using SafeERC20 for IERC20;
    // IERC20 public token;
    uint256 public maxSupply;

    constructor(
        // address _contractCreator,
        uint256 _maxSupply
    ) ERC20("VToken", "VTK") ERC20Permit("VToken") {
        // premints VTK
        mintERC20(address(this), 500);
        console.log("Minted 500 VTokens to contract address");
        mintERC20(msg.sender, 100);
        console.log(
            "Minted 100 VTokens to the contract creator (manufacturer)"
        );
        mintERC20(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, 50);
        console.log("Minted 100 VTokens to the distributor");
        maxSupply = _maxSupply;
        require(
            maxSupply <= 100000,
            "Max token supply must be less than or equal to 10,000"
        ); // throws error if max supply is set to a number greater than 500
        require(maxSupply >= 1, "Max token supply must be greater than 0"); // throws error if max supply is set to 0
    }

    function mintERC20(address to, uint256 amount) public {
        //uint256 total = totalSupply();
        //require(
        //    (total + amount) <= maxSupply,
        //    "Number of tokens minted to this address plus tokens in circulation should be less than the max supply");
        _mint(to, amount); // _mint is the building block that allows us to write ERC20 extensions that implement a supply mechanism
        console.log(msg.sender, " successfuly minted VTokens");
    }

    function stakeTokens(address to, uint256 amount) external payable {
        _transfer(msg.sender, address(this), amount);
        console.log(
            msg.sender,
            "has staked",
            amount,
            "VToken(s) to the contract"
        );
    }

    function withdrawTokens(address to, uint256 amount) external payable {
        _transfer(address(this), to, amount);
        console.log(
            msg.sender,
            "has withdrawn",
            amount,
            "VToken(s) from the contract"
        );
    }

    /*
    function permit(
        address owner,
        address spender,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public override {}

    
    function depositWithPermit(uint amount, uint deadline, uint8 v, bytes32 r, bytes32 s) external {
        token.permit(msg.sender, address(this), amount, deadline, v, r, s);
    }

    bytes32 public constant _PERMIT_TYPEHASH =
        keccak256(
            "Permit(address owner, address spender, uint256 value, uint256 nonce, uint256 deadline)"
        );

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (from != address(0) && to != address(0)) {
            _approve(
                from,
                _msgSender(),
                allowance(from, _msgSender()).sub(
                    amount,
                    "ERC20: transfer amount exceeds allowance"
                )
            );
        }
    }
*/
}
