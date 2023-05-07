const { assert } = require("chai")
const { network, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("nftmarketplace unit tests", () => {
       
        let nftMarketplaceContract, basicNftContract, deployer, player
        const price = ethers.utils.parseEther("0.1")
        const TOKEN_ID = 0
        beforeEach(async () => {
            accounts = await ethers.getSigners()
            deployer = accounts[0]
            player = accounts[1]
              await deployments.fixture(["all"])
              nftMarketplaceContract = await ethers.getContract("NftMarketPlace")
              basicNftContract = await ethers.getContract("BasicNft")
              //nftMarketplace = await NftMarketPlace.connect(player)
              //basicNft = await basicNft.connect(player)
              await basicNftContract.mintNft()
              await basicNftContract.approve(nftMarketplaceContract.address, TOKEN_ID) //why approve is called
          })

          it("lists and can be bought", async () => {
              await nftMarketplaceContract.listItem(basicNftContract.address, TOKEN_ID, price)
              nftMarketplace = await nftMarketplaceContract.connect(player)
              await nftMarketplace.buyItem(basicNftContract.address, TOKEN_ID, { value: price })
              const newOwner = await basicNftContract.ownerOf(TOKEN_ID)
             // console.log(network.name)
              const deployerProceeds = await nftMarketplaceContract.getProceeds(deployer.address)
              assert(newOwner.toString() == player.address)
              assert(deployerProceeds.toString() == price.toString())
          })
      })
