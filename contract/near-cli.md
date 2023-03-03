# NEAR CLI

## Test contract (show output)
```
cargo test -- --nocapture
```

## Build contract code
```
sh build.sh
```

## Delete contract subaccount (good practice)
```
near delete medapi.rohanphanse.testnet rohanphanse.testnet
```

## Create contract subaccount
```
near create-account medapi.rohanphanse.testnet --masterAccount rohanphanse.testnet --initialBalance 3
```

## Deploy contract
```
near deploy --wasmFile wasm/medical_api_marketplace.wasm --accountId medapi.rohanphanse.testnet
```

## Add account info (call)
```
near call medapi.rohanphanse.testnet add_account_info '{"public_key": "my public key!"}' --accountId rohanphanse.testnet
```

## Get account public key (view)
```
near view medapi.rohanphanse.testnet get_account_public_key '{"account_id": "rohanphanse.testnet"}'
```

## Add listing (call)
```
near call medapi.rohanphanse.testnet add_listing '{"listing_id": "i", "price": "100", "expires_after": 100000, "call_limit": 300, "title": "Corr 2", "description": "Lots of relations!"}' --accountId rohanphanse.testnet
```

## Get account listing IDs (view)
```
near view medapi.rohanphanse.testnet get_account_listing_ids '{"account_id": "rohanphanse.testnet"}'
```

## Get listing (view)
```
near view medapi.rohanphanse.testnet get_listing '{"listing_id": "i"}'
```

## Purchase listing (call)
```
near call medapi.rohanphanse.testnet purchase_listing '{"listing_id": "i"}' --accountId rohanphanse.testnet --amount 0.01
```

## Get account listing receipt (view)
```
near view medapi.rohanphanse.testnet get_account_listing_receipt '{"account_id": "rohanphanse.testnet", "listing_id": "i"}'
```