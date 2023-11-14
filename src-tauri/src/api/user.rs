use crate::api::request_with_token;
use crate::create_window::{create_login_window, create_main_window};
use crate::store::{KeyStore, ACCESS_TOKEN, REFRESH_TOKEN};

use reqwest::Method;
use serde_json::{from_str, Value};
use std::collections::HashMap;
use tauri::{command, Runtime};
use whoami::devicename;

use super::create_client;

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

  let client = create_client();
  let res = match client.post(&url).json(&params).send().await {
    Ok(res) if res.status().is_success() => res,
    Ok(res) => {
      return Err(res.status().as_u16());
    }
    Err(e) => match e.status() {
      Some(status) => {
        return Err(status.as_u16());
      }
      None => {
        return Err(600u16);
      }
    },
  };

  let body = res.text().await.map_err(|_| 500u16)?;
  let data: Value = from_str(&body).map_err(|_| 500u16)?;

  let store = KeyStore::new(REFRESH_TOKEN)?;
  let refresh_token = data["refresh_token"].as_str().ok_or(500u16)?;
  let _ = store.save(refresh_token);

  let store = KeyStore::new(ACCESS_TOKEN)?;
  let access_token = data["access_token"].as_str().ok_or(500u16)?;
  let _ = store.save(access_token);

  let _ = window.close();
  create_main_window(&app);

  Ok(())
}

pub async fn api_user_renew() -> Result<String, u16> {
  let url = format!("{}/api/user/renew", env!("API_URL"));

  let store = KeyStore::new(REFRESH_TOKEN)?;
  let refresh_token = store.get().map_err(|_| 401u16)?;

  let client = create_client();
  let res = match client.post(&url).bearer_auth(refresh_token).send().await {
    Ok(res) if res.status().is_success() => res,
    Ok(res) => {
      return Err(res.status().as_u16());
    }
    Err(e) => match e.status() {
      Some(status) => {
        return Err(status.as_u16());
      }
      None => {
        return Err(600u16);
      }
    },
  };

  let body = res.text().await.map_err(|_| 500u16)?;
  let data: Value = from_str(&body).map_err(|_| 500u16)?;

  let refresh_token = data["refresh_token"].as_str().ok_or(500u16)?;
  let _ = store.save(refresh_token);

  let store = KeyStore::new(ACCESS_TOKEN)?;
  let access_token = data["access_token"].as_str().ok_or(500u16)?;
  let _ = store.save(access_token);

  Ok(data["access_token"].to_string())
}

#[command]
pub async fn api_user_info<R: Runtime>(
  app: tauri::AppHandle<R>,
  window: tauri::Window<R>,
) -> Result<Value, u16> {
  let app_url = env!("API_URL");

  let url = format!("{}/api/user/info", app_url);

  match request_with_token(url.as_str(), Method::GET, None).await {
    Ok(res) => Ok(res),
    Err(e) => {
      if e == 401u16 || e == 403u16 {
        let _ = window.close();
        create_login_window(&app);
      }

      return Err(e);
    }
  }
}

#[command]
pub async fn api_user_logout<R: Runtime>(app: tauri::AppHandle<R>, window: tauri::Window<R>) {
  match KeyStore::new(ACCESS_TOKEN) {
    Ok(store) => {
      let _ = store.delete();
    }
    Err(_) => {}
  }

  match KeyStore::new(REFRESH_TOKEN) {
    Ok(store) => {
      match store.get() {
        Ok(token) => {
          let url = format!("{}/api/user/logout", env!("API_URL"));

          let client = create_client();
          let _ = client.post(&url).bearer_auth(token).send().await;
        }
        Err(_) => {}
      }

      let _ = store.delete();
    }
    Err(_) => {}
  }

  let _ = window.close();
  create_login_window(&app);
}
