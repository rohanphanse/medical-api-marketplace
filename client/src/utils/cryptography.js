// Reference: https://gist.github.com/pedrouid/b4056fd1f754918ddae86b32cf7d803e#rsassa-pkcs1-v1_5---generatekey
export async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: {name: "SHA-256"}, 
        },
        true,
        ["sign", "verify"]
    )
    return keyPair
}

export async function exportKey(key) {
    return await window.crypto.subtle.exportKey("jwk", key)
}

export async function importPublicKey(keyJSON) {
    return await window.crypto.subtle.importKey("jwk", keyJSON, {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" }, 
    }, true, ["verify"])
}

export async function importPrivateKey(keyJSON) {
    return await window.crypto.subtle.importKey("jwk", keyJSON, {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" }, 
    }, true, ["sign"])
}

function bufferToHex(buffer) {
    let hex = []
    for (const n of buffer) {
        hex.push(Number(n).toString(16).padStart(2, "0"))
    }
    return hex.join("")
}

export async function sign(privateKey, data) {
    const encoder = new TextEncoder()
    const signature = await window.crypto.subtle.sign({
        name: "RSASSA-PKCS1-v1_5"
    }, privateKey, encoder.encode(data))
    return bufferToHex(new Uint8Array(signature))
}

