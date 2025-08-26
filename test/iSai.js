const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("iSai Contract", function () {
  let iSai;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    const iSaiContract = await ethers.getContractFactory("iSai");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    iSai = await iSaiContract.deploy();
    await iSai.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await iSai.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Owner should be able to airdrop mint", async function () {
      await iSai
        .connect(owner)
        .airdropMint(
          addr1.address,
          "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E"
        );
      expect(await iSai.tokenURI(0)).to.equal(
        "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E"
      );
    });

    it("Others should not be able to airdrop mint", async function () {
      let error;
      try {
        await iSai
          .connect(addr1)
          .airdropMint(
            addr1.address,
            "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"
          );
      } catch (e) {
        error = e;
      }
      expect(error).to.exist;
      expect(error.message).to.include("Ownable: caller is not the owner");
    });
  });

  describe("Transfers", function () {
    beforeEach(async function () {
      await iSai
        .connect(owner)
        .airdropMint(
          addr1.address,
          "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
        );
    });

    it("Should not allow token transfers", async function () {
      let error;
      try {
        await iSai.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
      } catch (e) {
        error = e;
      }
      expect(error).to.exist;
      expect(error.message).to.include("iSai: Transfers are forbidden");
    });

    it("Should not allow token approvals", async function () {
      let error;
      try {
        await iSai.connect(addr1).approve(addr2.address, 0);
      } catch (e) {
        error = e;
      }
      expect(error).to.exist;
      expect(error.message).to.include("iSai: Transfers are forbidden");
    });
  });
});
