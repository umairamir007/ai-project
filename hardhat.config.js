require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [
        "2c63ceaab67ce67bfb69cc6961b555fc79f6501af26072c14b8efe9a07057e6a",
      ],
      gasPrice: 20000000000, // 20 Gwei
    },
  },
  etherscan: {
    apiKey: "8CF62HG6EYZD1UAQ5N3HPV7DF1F9S32R2G",
  },
};
