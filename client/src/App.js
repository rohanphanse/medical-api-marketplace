import React, { useState, useCallback, useEffect } from "react"
import AccountInfo from "./components/AccountInfo"
import { generateKeyPair, exportKey, importPublicKey, importPrivateKey, sign } from "./utils/cryptography"

const App = () => {
    const account = window.walletConnection.account()
    
    // State
    const [keyPair, updateKeyPair] = useState({})

    async function uploadOrGetPublicKey(accountId) {
        let publicKey = await window.contract.get_account_public_key({ account_id: accountId })
        if (publicKey === null) {
            const keyPair = await generateKeyPair()
            const publicKeyString = JSON.stringify(await exportKey(keyPair.publicKey))
            const privateKeyString = JSON.stringify(await exportKey(keyPair.privateKey))
            await window.contract.add_account_info({ public_key: publicKeyString })
            localStorage.setItem("privateKey", privateKeyString)
            publicKey = await window.contract.get_account_public_key({ account_id: accountId })
        }
        return await importPublicKey(JSON.parse(publicKey))
    }

    const fetchKeyPair = useCallback(async () => {
        let publicKey = await uploadOrGetPublicKey(account.accountId)
        let privateKey = null
        try {
            const privateKeyString = localStorage.getItem("privateKey")
            if (privateKeyString === null) throw "Cannot find private key in local storage"
            privateKey = await importPrivateKey(JSON.parse(privateKeyString))
        } catch (error) {
            console.error(error)
        }
        updateKeyPair({
            publicKey,
            privateKey
        })
    }, [account.accountId])
    useEffect(() => {
        fetchKeyPair()
    }, [fetchKeyPair])

    const apiURL = "http://localhost:5000/api/covid_analysis"
    async function requestAPIKey() {
        const unsignedTimestamp = Date.now().toString()
        const signedTimestamp = await sign(keyPair.privateKey, Date.now().toString())
        const response = await fetch(apiURL + "/request_key", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                accountId: account.accountId,
                unsignedTimestamp,
                signedTimestamp
            })
        })
        console.log("response", response)
        const data = await response.json()
        console.log("data", data)
    }
    

    return (
        <>
            <AccountInfo account={account} />
            <button onClick={() => requestAPIKey()}>Request API Key</button>
        </>
    )
}

export default App