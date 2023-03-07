import React, { useState, useEffect, useCallback } from "react";
import { accountBalance, login, logout } from "../utils/near";

// Using past project: https://github.com/rohanphanse/healthcare-data-system/blob/main/src/components/AccountInfo.js
export default function AccountInfo({ account }) {
    // Balance
    const [balance, updateBalance] = useState(localStorage.getItem("balance") || "---.--")
    const fetchBalance = useCallback(async () => {
        if (account.accountId) {
            // Fetch current balance on each page visit
            let current_balance = await accountBalance()
            // Cache last balance
            localStorage.setItem("balance", current_balance)
            updateBalance(current_balance)
        }
    }, [account.accountId])
    useEffect(() => {
        fetchBalance()
    }, [fetchBalance])
    return (
        <>
            <h2 className = "title">Medical API Marketplace</h2>
            {account.accountId ? (
                <div className = "account-info">
                    <div><b>Account:</b> {account.accountId}</div>
                    <div><b>Balance:</b> {balance} NEAR</div>
                    <button onClick={logout}>LOG OUT</button> 
                </div>
            ) : (
                <>
                    <div><b>By:</b> Rohan Phanse (<a href = "https://github.com/rohanphanse" target = "_blank" rel = "noreferrer">github</a>)</div>
                    <button className = "connect-wallet" onClick={login}>CONNECT WALLET</button>
                </>
            )}
            <style jsx = "true">{`
                .account-info {
                    margin-bottom: 20px;
                }
                .title {
                    margin: 0;
                }
                .connect-wallet {
                    margin-top: 10px;
                }
            `}</style>
        </>
    )
}