const { providers } = require("near-api-js")
const express = require("express")
const crypto = require("crypto")
const fs = require("fs/promises")
const logger = require("morgan")
require("dotenv").config()

const provider = new providers.JsonRpcProvider("https://rpc.testnet.near.org")
const accountId = "rohanphanse.testnet"

async function initializeAPI() {
    const app = express()
    app.use(express.json())

    const apiKeys = JSON.parse(await fs.readFile("./data/api_keys.json", { encoding: "utf8" }) || "{}")
    const userToKey = {}
    for (key in apiKeys) {
        const user = apiKeys[key][0].toString()
        userToKey[user] = key
    } 
    console.log("userToKey", userToKey)
    const serviceToListingId = {
        "covid_analysis": "i2"
    }

    app.post("/api/:service/request_key", async (req, res) => {
        console.log("uTK", userToKey)
        const service = req.params.service
        console.log("service", service)
        if (!serviceToListingId.hasOwnProperty(service)) {
            return res.status(400).send({ message: `No service with name '${service}' found :(` })
        }
        const listingId = serviceToListingId[service]
        console.log("listingId", listingId)
        if (!req.body.hasOwnProperty("accountId")) {
            return res.status(400).send({ message: "Request is missing an account ID!"})
        }
        const publicKey = await queryBlockchain("get_account_public_key", { account_id: req.body.accountId })
        console.log("publicKey", publicKey)
        if (typeof publicKey !== "string") {
            return res.status(400).send({ message: `Could not fetch public key for blockchain account with ID ${req.body.accountId}`})
        }
        const accountId = req.body.accountId
        console.log("accountId", accountId)
        if (!req.body.signedTimestamp || !req.body.unsignedTimestamp) {
            return res.status(400).send({ message: "Missing signed and/or unsigned timestamps!"})
        }
        let unsignedTimestamp = req.body.unsignedTimestamp.toString()
        let signedTimestamp = Buffer.from(req.body.signedTimestamp.toString(), "base64")
        let max_time_diff = 10 * 60 * 1000 // 10 minutes = 600,000 ms
        console.log("unsignedTimestamp", unsignedTimestamp)
        console.log("signedTimestamp", signedTimestamp)
        if (!isFinite(unsignedTimestamp) || Date.now() - +unsignedTimestamp > max_time_diff) {
            return res.status(400).send({ message: "Invalid timestamp!" })
        }
        // if (!verify(unsignedTimestamp, JSON.parse(publicKey), signedTimestamp)) {
        //     return res.status(400).send({ message: "Could not verify signature :(" })
        // }
        const receipt = await queryBlockchain("get_account_listing_receipt", { account_id: accountId, listing_id: listingId })
        console.log("receipt", receipt)
        if (receipt === null) {
            return res.status(400).send({ message: `Could not find receipt for account ID '${accountId}' and listing ID '${listingId}' on blockchain. Make sure to purchase the license to obtain the receipt.` })
        }
        let apiKey = crypto.randomBytes(20).toString("hex")
        const oldKey = userToKey[accountId]
        console.log("oldKey", oldKey)
        if (oldKey) {
            delete apiKeys[oldKey]
            userToKey[accountId] = apiKey.toString()
        }
        console.log("userToKey", userToKey)
        console.log("apiKeys", apiKeys)
        // apiKeys[apiKey] = [accountId, receipt.purchased_at]
        console.log("#", apiKeys)
        await fs.writeFile("./data/api_keys.json", JSON.stringify(apiKeys))
        return res.status(200).send({ key: apiKey })
    })

    // Allow cross domain requests: https://stackoverflow.com/questions/18642828/origin-origin-is-not-allowed-by-access-control-allow-origin
    function allowCrossDomain(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
        res.header("Access-Control-Allow-Headers", "Content-Type")
        next()
    }
    // Middleware
    app.use(allowCrossDomain)
    app.use(logger("dev"))

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

function verify(unsignedData, publicKey, signature) {
    return crypto.verify("RSASSA-PKCS1-v1_5", unsignedData, crypto.createPublicKey({ key: publicKey }), signature)
}

async function queryBlockchain(method_name, data) {
    try {
        // Reference: https://docs.near.org/api/rpc/contracts
        const raw = await provider.query({
            request_type: "call_function",
            account_id: "medapi.rohanphanse.testnet",
            method_name,
            args_base64: Buffer.from(JSON.stringify(data)).toString("base64"),
            finality: "final"
        })
        const result = JSON.parse(Buffer.from(raw.result).toString())
        return result
    } catch (error) {
        console.error(error)
        return null
    }
}

initializeAPI()