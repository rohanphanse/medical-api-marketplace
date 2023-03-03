const { connect, keyStores } = require("near-api-js")
const express = require("express")
const path = require("path")
const homedir = require("os").homedir()
const crypto = require("crypto")
require("dotenv").config()

// Credit: https://docs.near.org/tools/near-api-js/faq
const networkId = "testnet"
const accountId = "rohanphanse.testnet"
const CREDENTIALS_DIR = ".near-credentials"
const CONTRACT_NAME = "medapi.rohanphanse.testnet";
const credentialsPath = path.join(homedir, CREDENTIALS_DIR, networkId, `${accountId}.json`)
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath)
const config = {
    keyStore,
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
}

function verify(unsignedData, publicKey, signature) {
    return crypto.verify("SHA256", unsignedData, publicKey, Buffer.from(signature, "base64"))
}

// Connect to NEAR blockchain
async function initializeAPI() {
    const near = await connect({ ...config, keyStore })
    const contract = await near.account(CONTRACT_NAME)
    
    const app = express()
    app.use(express.json())

    const service_to_listing_id = {
        "test": "i",
    }
    app.post("/api/:service", (req, res) => {
        const service = req.params.service
        if (!service_to_listing_id.hasOwnProperty(service)) {
            return res.status(400).send({ message: `No service with name '${service}' found :(` })
        }
        if (!req.body.hasOwnProperty("accountId")) {
            return res.status(400).send({ message: "Request is missing an account ID!"})
        }
        const publicKey = contract.getAccountPublicKey(req.body.accountId)
        if (typeof publicKey !== "string") {
            return res.status(400).send({ message: `Could not fetch public key for blockchain account with ID ${req.body.accountId}`})
        }
        if (!req.body.hasProperty("signedTimestamp") || !req.body.hasOwnProperty("unsignedTimestamp")) {
            return res.status(400).send({ message: "Missing signed and/or unsigned timestamps!"})
        }
        let unsignedTimestamp = req.body.unsignedTimestamp.toString()
        let max_time_diff = 10 * 60 * 1000 // 10 minutes = 600,000 ms
        if (!isFinite(unsignedTimestamp) || Date.now() - +unsignedTimestamp > max_time_diff) {
            return res.status(400).send({ message: "Invalid timestamp!" })
        }
        if (!verify(unsignedTimestamp, publicKey, signedTimestamp)) {
            return res.status(400).send({ message: "Could not verify signature :(" })
        }
        return res.status(200).send({ message: "All checks cleared!" })
    })

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

initializeAPI()