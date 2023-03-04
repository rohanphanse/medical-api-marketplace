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
near call medapi.rohanphanse.testnet add_account_info '{"public_key": "-----BEGIN PUBLIC KEY-----MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAxK6Vy5MHOjLnBlXAvKZ0KUpzNHxH3HUQ6X4wRgH8UbUStRS3lVcdxrcTzC7qPIsyA5mmiXVGOjy8wPdZd3RQpDMtE0JeZGbOqkiUg95CJP3UAw+Y3IO6QJ/9LitVSqS30guU4mxsB0g8nhPOnYqzo7zpTv93YcYmHy+sw3/ACCt7FJmbJc+5dEfac6HVhSqXbntYQz+yDXGbjB0YcDEuzf23SJSIMiTwsZCkhWVlor5ffS6OX5sElSPR99YQWZAUh8QQt+dQ3ahh8bGc0GtBLcRmjKSN0EvDK244pmArR2mnUxY/C3iKpp2Ngr89GQeiD0VJcDvPYfx+5H8/FUFuWOoVHBV1ereGzXg/rINHkdva++o/zXG9cA9M2fVxOOWYZXRs2x/IHaHYx4ZFJog9KJ63w7GxKdl8KB2BNX9MVSxXWqUJ3lFJpTjruEQwwtO9BMZdGIO6SsD5qSKDoWuvXHfhY0fsniigtivIY5zIahu+7khPgrseQ932VOHT2URpbrglH9tajuwip0DyQCOAgQWOQL1Itg3ddlRZTXGkH4tsMHxGuSX6kQtpIkJ1sUQAAGZWO/nJ7cOzfID0o4jizTQUiNxP0MOgUzAdf9uQrQKSuosXDqbqqBBvaMoyHT4lQMiDtP+EluIFBKuWA6cEWKplc4VDiXkA0Ri2blDX4cMCAwEAAQ==-----END PUBLIC KEY-----"}' --accountId rohanphanse.testnet
```

## Get account public key (view)
```
near view medapi.rohanphanse.testnet get_account_public_key '{"account_id": "rohanphanse.testnet"}'
```

## Add listing (call)
```
near call medapi.rohanphanse.testnet add_listing '{"listing_id": "i2", "price": "100", "expires_after": 100000, "call_limit": 300, "title": "Corr 2", "description": "Lots of relations!"}' --accountId rohanphanse.testnet
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