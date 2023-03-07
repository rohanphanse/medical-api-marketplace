use near_sdk::borsh::{ self, BorshDeserialize, BorshSerialize };
use near_sdk::{ env, near_bindgen, AccountId, Promise, json_types::U128 };
use near_sdk::collections::{ UnorderedMap, UnorderedSet };

mod account;
use account::AccountInfo;
mod listing;
use listing::{ Listing, ListingId };
mod receipt;
use receipt::Receipt;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    account_map: UnorderedMap<AccountId, AccountInfo>,
    listing_map: UnorderedMap<ListingId, Listing>,
    listing_ids_map: UnorderedMap<AccountId, UnorderedSet<ListingId>>,
    receipt_map: UnorderedMap<AccountId, UnorderedMap<ListingId, Receipt>>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            account_map: UnorderedMap::<AccountId, AccountInfo>::new(b"a".to_vec()),
            listing_map: UnorderedMap::<ListingId, Listing>::new(b"l".to_vec()),
            listing_ids_map: UnorderedMap::<AccountId, UnorderedSet<ListingId>>::new(b"i".to_vec()),
            receipt_map: UnorderedMap::<AccountId, UnorderedMap<ListingId, Receipt>>::new(b"r".to_vec()),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn add_account_info(&mut self, public_key: String) {
        let account_id = env::signer_account_id();
        if self.account_map.get(&account_id) == None {
            self.account_map.insert(&account_id, &AccountInfo::new(public_key));
        }
    }

    pub fn get_account_public_key(&self, account_id: AccountId) -> Option<String> {
        if let Some(account_info) = self.account_map.get(&account_id) {
            return Some(account_info.get_public_key());
        } else {
            return None;
        }
    }

    pub fn delete_account_info(&mut self) {
        let account_id = env::signer_account_id();
        self.account_map.remove(&account_id);
    }

    pub fn add_listing(&mut self, listing_id: ListingId, price: U128, expires_after: u64, call_limit: i32, title: String, description: String) {
        let signer_id = env::signer_account_id();
        if let Some(_) = self.listing_map.get(&listing_id) {
            panic!("Listing with id {} already exists! Choose another id.", &listing_id);
        }
        if listing_id.len() > 20 || listing_id.len() < 1 {
            panic!("Listing id must be between 1 and 20 characters in length!");
        }
        let listing = Listing::new(signer_id.clone(), price, expires_after, call_limit, title, description);
        self.listing_map.insert(&listing_id, &listing);
        if self.listing_ids_map.get(&signer_id).is_none() {
            let set_id: Vec<u8> = format!("l-{}", signer_id).as_bytes().to_vec();
            self.listing_ids_map.insert(&signer_id, &UnorderedSet::new(set_id));
        }
        let mut listing_ids = self.listing_ids_map.get(&signer_id).unwrap();
        listing_ids.insert(&listing_id);
        self.listing_ids_map.insert(&signer_id, &listing_ids);
    }

    pub fn get_account_listing_ids(&self, account_id: AccountId) -> Vec<ListingId> {
        if let Some(listing_ids) = self.listing_ids_map.get(&account_id) {
            return listing_ids.to_vec();
        } else {
            return vec![];
        }
    }

    pub fn get_listing(&self, listing_id: ListingId) -> Option<Listing> {
        return self.listing_map.get(&listing_id);
    }

    #[payable]
    pub fn purchase_listing(&mut self, listing_id: ListingId) {
        let signer_id = env::signer_account_id();
        if let Some(receipts) = self.receipt_map.get(&signer_id) {
            if let Some(_) = receipts.get(&listing_id) {
                panic!("Already purchased listing with id {}!", listing_id);
            }
        }
        if let Some(listing) = self.listing_map.get(&listing_id) {
            assert!(env::attached_deposit() >= listing.get_price().0, "Attached deposit should be equal to or greater than listing price.");
            Promise::new(listing.get_seller()).transfer(listing.get_price().0);
            Promise::new(signer_id.clone()).transfer(env::attached_deposit() - listing.get_price().0);
            if self.receipt_map.get(&signer_id).is_none() {
                let map_id: Vec<u8> = format!("m-{}", signer_id).as_bytes().to_vec();
                self.receipt_map.insert(&signer_id, &UnorderedMap::new(map_id));
            }
            let mut receipts = self.receipt_map.get(&signer_id).unwrap();
            receipts.insert(&listing_id, &Receipt::new(env::block_timestamp_ms()));
            self.receipt_map.insert(&signer_id, &receipts);
        } else {
            panic!("Cannot find listing with id {} :(", listing_id);
        }
    }

    pub fn get_account_listing_receipt(&self, account_id: AccountId, listing_id: ListingId) -> Option<Receipt> {
        if let Some(account_receipts) = self.receipt_map.get(&account_id) {
            return account_receipts.get(&listing_id);
        } else {
            return None;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::{ VMContextBuilder };
    use near_sdk::{ testing_env, AccountId };

    fn get_context(signer: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.signer_account_id(signer);
        builder
    }

    #[test]
    fn create_account_and_add_public_key() {
        let context = get_context("alice.testnet".parse::<AccountId>().unwrap());
        testing_env!(context.build());
        let mut contract = Contract::default();
        contract.add_account_info("public key".to_string());
        contract.add_account_info("public key 2".to_string()); // Should not be added
        assert_eq!(
            contract.get_account_public_key("alice.testnet".parse::<AccountId>().unwrap()).unwrap(),
            "public key".to_string()
        );
    }

    #[test]
    fn add_and_get_listing() {
        let context = get_context("alice.testnet".parse::<AccountId>().unwrap());
        testing_env!(context.build());
        let mut contract = Contract::default();
        contract.add_listing("my id".to_string(), U128(10), 1000, 200, "title".to_string(), "desc".to_string());
        contract.add_listing("my id 2".to_string(), U128(10), 10000, 1000, "title 2".to_string(), "desc 2".to_string());
        assert_eq!(
            contract.get_account_listing_ids("alice.testnet".parse::<AccountId>().unwrap()),
            vec!["my id", "my id 2"]
        );
        println!("{:?}", contract.get_listing("my id 2".to_string()));
        assert_eq!(
            contract.get_listing("my id 2".to_string()).unwrap().get_price(),
            U128(10)
        );
    }
}