import environment from "./config"
import { connect, Contract, keyStores, WalletConnection } from "near-api-js"
import { formatNearAmount } from "near-api-js/lib/utils/format"

const nearEnv = environment("testnet")

export async function initializeContract() {
    const near = await connect(
        Object.assign(
            { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
            nearEnv
        )
    )
    window.walletConnection = new WalletConnection(near)
    window.accountId = window.walletConnection.getAccountId()
    window.contract = new Contract(
        window.walletConnection.account(),
        nearEnv.contractName,
        {
            viewMethods: ["get_account_public_key", "get_account_listing_ids", "get_account_listing_receipt"],
            changeMethods: ["add_account_info", "delete_account_info", "add_listing", "purchase_listing"]
        }
    )
}

export async function accountBalance() {
    return formatNearAmount(
        (await window.walletConnection.account().getAccountBalance()).total,
        2
    )
}

export function getAccountId() {
    return window.walletConnection.getAccountId()
}

export function login() {
    window.walletConnection.requestSignIn(nearEnv.contractName)
}

export function logout() {
    window.walletConnection.signOut()
    window.location.reload()
}