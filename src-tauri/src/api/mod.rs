pub mod user;

use reqwest::{Method, StatusCode};
use serde_json::Value;
use std::{collections::HashMap, time::Duration};

use crate::store::{KeyStore, ACCESS_TOKEN};

pub const API_TIMEOUT: u64 = 30;

pub fn create_client() -> reqwest::Client {
  reqwest::Client::builder()
    .timeout(Duration::from_secs(API_TIMEOUT))
    .build()
    .unwrap()
}

pub async fn request_with_token(
  url: &str,
  method: Method,
  params: Option<HashMap<&str, &str>>,
) -> Result<Value, u16> {
  let client = create_client();

  let store = KeyStore::new(ACCESS_TOKEN).map_err(|_| 401u16)?;
  let access_token = store.get().map_err(|_| 401u16)?;

  let req_builder = client
    .request(method.clone(), url)
    .bearer_auth(access_token);

  let req_builder = if params.is_some() && (method == Method::POST || method == Method::PUT) {
    req_builder.json(&params)
  } else {
    req_builder
  };

  let res = match req_builder.send().await {
    Ok(res) if res.status().is_success() => res,
    Ok(res) => {
      let status_code = res.status().as_u16();

      if status_code != 401u16 {
        return Err(status_code);
      }

      let access_token = match user::api_user_renew().await {
        Ok(access_token) => access_token,
        Err(e) => {
          if e == 401u16 {
            return Err(e);
          }
          return Err(e);
        }
      };

      let req_builder = client
        .request(method.clone(), url)
        .bearer_auth(access_token);

      let req_builder = if params.is_some() && (method == Method::POST || method == Method::PUT) {
        req_builder.json(&params)
      } else {
        req_builder
      };

      match req_builder.send().await {
        Ok(res) if res.status().is_success() => res,
        Ok(res) => {
          return Err(res.status().as_u16());
        }
        Err(e) => {
          return Err(
            e.status()
              .unwrap_or(StatusCode::INTERNAL_SERVER_ERROR)
              .as_u16(),
          )
        }
      }
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
  let data: Value = serde_json::from_str(&body).map_err(|_| 500u16)?;

  Ok(data)
}
