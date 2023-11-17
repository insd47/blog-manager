use fs2::FileExt;
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_json::{json, Value};
use std::default;
use std::fmt::Debug;
use std::fs::{self, OpenOptions};
use std::io::{Seek, SeekFrom};
use std::path::PathBuf;

pub struct PreferenceStore<'a, T> {
  key: &'a str,
  value: T,
  dir: String,
}

impl<'a, T> PreferenceStore<'a, T>
where
  T: Serialize + DeserializeOwned + Clone + Debug,
{
  pub(crate) fn new(
    key: &'a str,
    dir_name: &str,
    default_value: &T,
  ) -> Result<PreferenceStore<'a, T>, u16> {
    // os별 기본 경로
    let base_dir = match std::env::consts::OS {
      "macos" => PathBuf::from(std::env::var("HOME").unwrap_or_else(|_| "".to_string()))
        .join("Library")
        .join("Application Support")
        .join(env!("BUNDLE_ID")),
      "windows" => PathBuf::from(std::env::var("LOCALAPPDATA").unwrap_or_else(|_| "".to_string()))
        .join(env!("APP_ID_CAMEL")),
      _ => PathBuf::from(std::env::var("HOME").unwrap_or_else(|_| "".to_string()))
        .join(".config")
        .join(env!("APP_ID")),
    };

    // 해당 파일의 경로
    let dir = base_dir.join(format!("{}.json", dir_name));

    // 폴더가 없으면 생성
    if let Some(parent_dir) = dir.parent() {
      if !parent_dir.exists() {
        fs::create_dir_all(parent_dir).map_err(|_| 602u16)?;
      }
    }

    let file = OpenOptions::new()
      .read(true)
      .write(true)
      .create(true) // 파일이 없으면 생성
      .open(&dir)
      .map_err(|_| 602u16)?;

    file.lock_exclusive().map_err(|_| 602u16)?;

    let value = match serde_json::from_reader::<_, Value>(&file) {
      Ok(json_value) => {
        file.unlock().map_err(|_| 602u16)?;

        // 파일 구조가 다르면 기본값으로 생성
        match serde_json::from_value::<T>(json_value.clone()[key].clone()) {
          Ok(value) => value,
          Err(_) => default_value.clone(),
        }
      }
      // 파일이 없으면 기본값으로 생성
      Err(_e) => {
        let json_value = json!({ key: &default_value });
        serde_json::to_writer(&file, &json_value).map_err(|_| 602u16)?;
        file.unlock().map_err(|_| 602u16)?;
        default_value.clone()
      }
    };

    Ok(PreferenceStore {
      key,
      value,
      dir: dir.to_string_lossy().to_string(),
    })
  }

  pub(crate) fn save(&self, value: &T) -> Result<(), u16> {
    let mut file = OpenOptions::new()
      .read(true)
      .write(true)
      .create(true) // 파일이 없으면 생성
      .open(&self.dir)
      .map_err(|_| 602u16)?;

    file.lock_exclusive().map_err(|_| 602u16)?;

    let mut json_value: Value = match serde_json::from_reader(&file) {
      Ok(val) => val,
      Err(_) => json!({}), // 빈 파일 또는 유효하지 않은 JSON에 대한 처리
    };
    json_value[self.key] = serde_json::to_value(value).map_err(|_| 602u16)?;

    file.set_len(0).map_err(|_| 602u16)?;
    file.seek(SeekFrom::Start(0)).map_err(|_| 602u16)?; // 파일 포인터 재설정
    serde_json::to_writer(&file, &json_value).map_err(|_| 602u16)?;

    file.unlock().map_err(|_| 602u16)?;

    Ok(())
  }

  pub(crate) fn get(&self) -> Result<T, u16> {
    let value = self.value.clone();
    Ok(value)
  }

  pub(crate) fn delete(&self) -> Result<(), u16> {
    let file = OpenOptions::new()
      .read(true)
      .write(true)
      .open(&self.dir)
      .map_err(|_| 602u16)?;

    file.lock_exclusive().map_err(|_| 602u16)?;

    let mut json_value: Value = serde_json::from_reader(&file).map_err(|_| 602u16)?;
    json_value[self.key] = default::Default::default();

    file.set_len(0).map_err(|_| 602u16)?; // 기존 내용을 지우기
    serde_json::to_writer(&file, &json_value).map_err(|_| 602u16)?;

    file.unlock().map_err(|_| 602u16)?;

    Ok(())
  }
}
