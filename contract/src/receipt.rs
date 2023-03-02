use near_sdk::borsh::{ self, BorshDeserialize, BorshSerialize };

#[derive(BorshDeserialize, BorshSerialize, PartialEq)]
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