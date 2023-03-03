use near_sdk::borsh::{ self, BorshDeserialize, BorshSerialize };
use serde::{ Serialize, Deserialize };

#[derive(BorshDeserialize, BorshSerialize, PartialEq, Debug, Serialize, Deserialize)]
pub struct Receipt {
    purchased_at: u64,
}

impl Receipt {
    pub fn new(purchased_at: u64) -> Self {
        Self {
            purchased_at,
        }
    }

    pub fn get_purchased_at(&self) -> u64 {
        self.purchased_at
    }
}