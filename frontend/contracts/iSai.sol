    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;

    import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
    import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";
    import "@openzeppelin/contracts/utils/Counters.sol";

    contract iSai is ERC721, Ownable {
        using Counters for Counters.Counter;

        string private URI;
        Counters.Counter private _tokenIdCounter;

        constructor() ERC721("iSai", "iSai") {}

        mapping(uint => string) _tokenURIs;
        mapping(address => uint) public hasMinted;



        function _baseURI() internal view override returns (string memory) {
            return URI;
        }


         function payToAddress(address recipient, uint256 amount) public {
        uint256 RoyaltyCalc = amount;

        (bool success, ) = payable(recipient).call{ value: RoyaltyCalc}("");
        require(success, "Failed to send amount");
        }             


        function tokenURI(
            uint256 _tokenId
        ) public view override returns (string memory) {
            require(
                super._exists(_tokenId),
                "ERC721Metadata: URI query for nonexistent token"
            );
            return
                bytes(_tokenURIs[_tokenId]).length > 0 ? _tokenURIs[_tokenId] : "";
        }

        function _setTokenURI(uint _tokenId, string memory _tokenURI) internal {
            _tokenURIs[_tokenId] = _tokenURI;
        }

        function mintNFT(string memory _tokenURI) external {
            require(hasMinted[msg.sender] < 3, "You have already minted 3 nfts");
            hasMinted[msg.sender] += 1;
            uint256 _tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(msg.sender, _tokenId);
            _setTokenURI(_tokenId, _tokenURI);
        }

        // Overriding transfer functions to prevent transfers
        function transferFrom(
            address from,
            address to,
            uint256 tokenId
        ) public virtual override {
            revert("iSai: Transfers are forbidden");
        }

        function safeTransferFrom(
            address from,
            address to,
            uint256 tokenId
        ) public virtual override {
            revert("iSai: Transfers are forbidden");
        }

        function safeTransferFrom(
            address from,
            address to,
            uint256 tokenId,
            bytes memory _data
        ) public virtual override {
            revert("iSai: Transfers are forbidden");
        }

        function approve(address to, uint256 tokenId) public virtual override {
            revert("iSai: Transfers are forbidden");
        }

        function setApprovalForAll(
            address operator,
            bool approved
        ) public virtual override {
            revert("iSai: Transfers are forbidden");
        }
    }
