const { ethers } = require("hardhat")

async function mintAndList() {
    let price = ethers.utils.parseEther("0.1")
    const nftMarketplace = await ethers.getContract("NftMarketPlace")
    const basicNft = await ethers.getContract("BasicNft")
    console.log("minting..........")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const TokenId = mintTxReceipt.events[0].args.tokenId
    console.log("approving..........")

    const approvalTx = await basicNft.approve(nftMarketplace.address, TokenId)
    await approvalTx.wait(1)
    console.log("listing NFT...........") 

    const tx = await nftMarketplace.listItem(basicNft.address, TokenId, price)
    await tx.wait(1)
    console.log("listed")
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
