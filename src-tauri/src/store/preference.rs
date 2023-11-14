use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_json::{json, Value};
use std::default;
use std::fs;
use std::path::PathBuf;

pub struct PreferenceStore<'a, T> {
  key: &'a str,
  value: T,
  dir: String,
}

impl<'a, T> PreferenceStore<'a, T>
where
  T: Serialize + DeserializeOwned + Copy + Clone,
{
  pub(crate) fn new(
    key: &'a str,
    dir_name: &str,
    default_value: T,
  ) -> Result<PreferenceStore<'a, T>, u16> {
    let base_dir = match std::env::consts::OS {
      "macos" => PathBuf::from(std::env::var("HOME").unwrap_or_else(|_| "".to_string()))
        .join("Library")
        .join("Application Support"),
      "windows" => PathBuf::from(std::env::var("LOCALAPPDATA").unwrap_or_else(|_| "".to_string())),
      _ => PathBuf::from(std::env::var("HOME").unwrap_or_else(|_| "".to_string())).join(".config"),
    };
    let dir = base_dir
      .join(env!("APP_ID"))
      .join(format!("{}.json", dir_name));

    // 디렉토리 생성
    if let Some(parent_dir) = dir.parent() {
      if !parent_dir.exists() {
        fs::create_dir_all(parent_dir).map_err(|_| 602u16)?;
      }
    }

    let value = match fs::read_to_string(&dir) {
      Ok(value) => {
        let json_value: Value = serde_json::from_str(&value).map_err(|_| 602u16)?;
        let value = serde_json::from_value(json_value[key].clone()).map_err(|_| 602u16)?;

        value
      }
      Err(_) => {
        let json_value = json!({key: default_value});
        let string_json = serde_json::to_string(&json_value).map_err(|_| 602u16)?;

        let _ = fs::write(&dir, &string_json);
        default_value
      }
    };

    Ok(PreferenceStore {
      key,
      value,
      dir: dir.to_string_lossy().to_string(),
    })
  }

  pub(crate) fn save(&self, value: T) -> Result<(), u16> {
    let json_value = fs::read_to_string(self.dir.as_str()).map_err(|_| 602u16)?;
    let mut json_value: Value = serde_json::from_str(json_value.as_str()).map_err(|_| 602u16)?;

    let value = serde_json::to_value(value).map_err(|_| 602u16)?;
    json_value[self.key] = value;

    let json_value = serde_json::to_string(&json_value).map_err(|_| 602u16)?;
    fs::write(self.dir.as_str(), &json_value).map_err(|_| 602u16)?;
    Ok(())
  }

  pub(crate) fn get(&self) -> Result<T, u16> {
    let value = self.value;
    Ok(value)
  }

  pub(crate) fn delete(&self) -> Result<(), u16> {
    let json_value = fs::read_to_string(self.dir.as_str()).map_err(|_| 602u16)?;
    let mut json_value: Value = serde_json::from_str(json_value.as_str()).map_err(|_| 602u16)?;

    json_value[self.key] = default::Default::default();

    let json_value = serde_json::to_string(&json_value).map_err(|_| 602u16)?;
    fs::write(self.dir.as_str(), &json_value).map_err(|_| 602u16)?;
    Ok(())
  }
}
