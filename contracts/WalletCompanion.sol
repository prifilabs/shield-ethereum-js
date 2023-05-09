// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

// import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';

import './Shield.sol';

contract WalletCompanion is
    Shieldable,
    ReentrancyGuard,
    ERC721Holder,
    ERC1155Holder
{
    constructor(Shield shield) payable Shieldable(shield) {}

    receive() external payable {}

    fallback() external payable {}

    function transferEth(
        address payable to,
        uint256 amount
    ) public nonReentrant shielded {
        (bool sent, ) = to.call{value: amount}('');
        require(sent);
    }

    using SafeERC20 for IERC20;

    function transferERC20(
        IERC20 token,
        address to,
        uint256 value
    ) public nonReentrant shielded {
        IERC20(token).safeTransfer(to, value);
    }

    function transferERC721(
        IERC721 token,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) public nonReentrant shielded {
        IERC721(token).safeTransferFrom(address(this), to, tokenId, data);
    }

    function transferERC1155(
        IERC1155 token,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) public nonReentrant shielded {
        IERC1155(token).safeTransferFrom(address(this), to, id, amount, data);
    }
}
