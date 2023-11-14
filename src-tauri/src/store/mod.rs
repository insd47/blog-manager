use keyring::Entry;

pub mod preference;
use serde::{de, Deserialize, Serialize};

// use state::InitCell;

// states

// keyring
pub struct KeyStore<'a> {
  id: &'a str,
  entry: Entry,
}
impl KeyStore<'_> {
  pub(crate) fn new(id: &str) -> Result<KeyStore, u16> {
    let entry = Entry::new(env!("APP_ID"), id).map_err(|_| 601u16)?;
    Ok(KeyStore { id, entry })
  }

  pub(crate) fn save(&self, token: &str) -> Result<(), u16> {
    self.entry.set_password(token).map_err(|_| 601u16)?;
    Ok(())
  }

  pub(crate) fn get(&self) -> Result<String, u16> {
    let token = self.entry.get_password().map_err(|_| 601u16)?;
    Ok(token)
  }

  pub(crate) fn delete(&self) -> Result<(), u16> {
    self.entry.delete_password().map_err(|_| 601u16)?;
    Ok(())
  }
}

pub const ACCESS_TOKEN: &str = "ACCESS_TOKEN";
pub const REFRESH_TOKEN: &str = "REFRESH_TOKEN";

// preference constants
pub const PREFERENCES: &str = "PREFERENCES";
pub const WINDOW_PREFERENCE: &str = "WINDOW_PREFERENCE";

// preference structures
#[derive(Serialize, Deserialize, Copy, Clone, Debug)]
pub struct WindowPreference {
  pub maximized: bool,
  pub fullscreen: bool,
  pub width: u32,
  pub height: u32,
}
