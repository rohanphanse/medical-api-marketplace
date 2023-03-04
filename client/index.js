const { connect, keyStores } = require("near-api-js")
const fs = require("fs/promises")
const path = require("path")
const homedir = require("os").homedir()
const crypto = require("crypto")

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

async function generateKeyPair() {
    return new Promise((resolve, reject) => {
        crypto.generateKeyPair("rsa", {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: "spki",
                format: "pem"
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem"
            }
        }, (error, publicKey, privateKey) => {
            if (error) return reject(error)
            resolve({ publicKey, privateKey })
        })
    })
}

function sign(data, privateKey) {
    const signature = crypto.sign("SHA256", data, privateKey);
    return signature.toString("base64")
}

async function main() {
    const near = await connect({ ...config, keyStore })
    const contract = await near.account(CONTRACT_NAME)
    // Contract calls not working...
    // To do: learn how to make contract calls using NEAR JS API
    console.log((await generateKeyPair()).publicKey)
    // if (typeof await contract.get_account_public_key(accountId) !== "string") {
    //     console.log("Generating asymmetric key pair...")
    //     let [publicKey, privateKey] = generateKeyPair()
    //     console.log(publicKey)
    //     console.log(privateKey)
    //     await contract.add_account_info(publicKey)
    //     await fs.writeFile(path.join(__dirname, "keys.env"), `PUBLIC_KEY = "${publicKey}"\nPRIVATE_KEY = "${privateKey}"`)
    //     console.log(`Saved keys locally to ${path.join(__dirname, "keys.env")}`)
    // }
    // let publicKey = process.env.publicKey
    // let privateKey = process.env.privateKey
}

main()