# Medical API Marketplace

## Overview
The `/contract` directory houses the Rust smart contracts and the compiled WebAssembly contract which can be deployed to the NEAR blockchain.

The `/api` directory holds the Node.js API instance which connects to the blockchain and serves API requests to callers who have purchased a license through the blockchain marketplace.

The `/client` directory contains the code callers would use to query the blockchain and API instances.