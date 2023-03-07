import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from "./App"
import { initializeContract } from "./utils/near"

window.nearInitPromise = initializeContract()
    .then(() => {
        ReactDOM.render(
            <React.StrictMode>
                <BrowserRouter>
                    <Routes>
                        <Route path = "/" element = {<App />} />
                    </Routes>
                </BrowserRouter>
            </React.StrictMode>,
            document.getElementById("root")
        )
    })
    .catch("Error", console.error)