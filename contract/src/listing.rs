use near_sdk::borsh::{ self, BorshDeserialize, BorshSerialize };
use near_sdk::{ AccountId, json_types::U128 };

pub type ListingId = String;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Listing {
    seller: AccountId,
    price: U128,
    expires_after: u64,
    call_limit: i32,
    title: String,
    description: String,
}

impl Listing {
    pub fn new(seller: AccountId, price: U128, expires_after: u64, call_limit: i32, title: String, description: String) -> Self {
        Self {
            seller,
            price,
            expires_after,
            call_limit,
            title,
            description
        }
    } 

    pub fn get_seller(&self) -> AccountId {
        self.seller.clone()
    }

    pub fn get_price(&self) -> U128 {
        self.price.clone()
    }

    pub fn get_expires_after(&self) -> u64 {
        self.expires_after
    }

    pub fn get_call_limit(&self) -> i32 {
        self.call_limit
    }

    pub fn get_title(&self) -> String {
        self.title.clone()
    }

    pub fn get_description(&self) -> String {
        self.description.clone()
    }
}