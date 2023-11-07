use crate::api::request_with_token;
use crate::store::{ACCESS_TOKEN, REFRESH_TOKEN};

use keyring::Entry;
use reqwest::Method;
use reqwest::StatusCode;
use serde_json::{from_str, Value};
use std::collections::HashMap;
use tauri::{command, Runtime};
use whoami::devicename;

use crate::create_window::create_main_window;

#[command]
pub async fn api_user_login<R: Runtime>(
  app: tauri::AppHandle<R>,
  window: tauri::Window<R>,
  email: String,
  password: String,
) -> Result<(), u16> {
  // get env
  let url = format!("{}/api/user/login", env!("API_URL"));
  let device_name = devicename();

  let params = HashMap::from([
    ("email", email.as_str()),
    ("password", password.as_str()),
    ("deviceName", device_name.as_str()),
  ]);

  let client = reqwest::Client::new();
  let res = match client.post(&url).json(&params).send().await {
    Ok(res) if res.status().is_success() => res,
    Ok(res) => {
      return Err(res.status().as_u16());
    }
    Err(e) => {
      return Err(
        e.status()
          .unwrap_or(StatusCode::INTERNAL_SERVER_ERROR)
          .as_u16(),
      );
    }
  };

  let body = res.text().await.map_err(|_| 500u16)?;
  let data: Value = from_str(&body).map_err(|_| 500u16)?;

  let entry = Entry::new(env!("APP_ID"), REFRESH_TOKEN).map_err(|_| 500u16)?;

  entry
    .set_password(&data["refresh_token"].as_str().unwrap())
    .map_err(|_| 500u16)?;

  let entry = Entry::new(env!("APP_ID"), ACCESS_TOKEN).map_err(|_| 500u16)?;

  entry
    .set_password(&data["access_token"].as_str().unwrap())
    .map_err(|_| 500u16)?;

  let _ = window.close();
  create_main_window(&app);

  Ok(())
}

pub async fn api_user_renew() -> Result<String, u16> {
  let app_url = env!("API_URL");
  let app_id = env!("APP_ID");

  let url = format!("{}/api/user/renew", app_url);

  let entry = match Entry::new(app_id, REFRESH_TOKEN) {
    Ok(entry) => entry,
    Err(_) => return Err(401),
  };

  let refresh_token = match entry.get_password() {
    Ok(refresh_token) => refresh_token,
    Err(_) => return Err(401),
  };

  let client = reqwest::Client::new();
  let res = match client.post(&url).bearer_auth(refresh_token).send().await {
    Ok(res) if res.status().is_success() => res,
    Ok(res) => {
      return Err(res.status().as_u16());
    }
    Err(e) => {
      return Err(
        e.status()
          .unwrap_or(StatusCode::INTERNAL_SERVER_ERROR)
          .as_u16(),
      );
    }
  };

  let body = res.text().await.map_err(|_| 500u16)?;
  let data: Value = from_str(&body).map_err(|_| 500u16)?;

  entry
    .set_password(&data["refresh_token"].as_str().unwrap())
    .map_err(|_| 500u16)?;

  let entry = Entry::new(app_id, ACCESS_TOKEN).map_err(|_| 500u16)?;

  entry
    .set_password(&data["access_token"].as_str().unwrap())
    .map_err(|_| 500u16)?;

  Ok(data["access_token"].to_string())
}

#[command]
pub async fn api_user_info() -> Result<Value, u16> {
  let app_url = env!("API_URL");

  let url = format!("{}/api/user/info", app_url);

  request_with_token(url.as_str(), Method::GET, None).await
}
