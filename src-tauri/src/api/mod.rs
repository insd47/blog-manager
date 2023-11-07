pub mod user;

use keyring::Entry;
use reqwest::{Method, StatusCode};
use serde_json::Value;
use std::collections::HashMap;

use crate::store::ACCESS_TOKEN;

pub async fn request_with_token(
  url: &str,
  method: Method,
  params: Option<HashMap<&str, &str>>,
) -> Result<Value, u16> {
  let client = reqwest::Client::new();

  let entry = Entry::new(env!("APP_ID"), ACCESS_TOKEN).map_err(|_| 401u16)?;

  let access_token = entry.get_password().map_err(|_| 401u16)?;

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
      return Err(res.status().as_u16());
    }
    Err(e) => {
      let status_code = e
        .status()
        .unwrap_or(StatusCode::INTERNAL_SERVER_ERROR)
        .as_u16();

      if status_code == 401u16 {
        let access_token = user::api_user_renew().await.map_err(|e| e)?;

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
      } else {
        return Err(status_code);
      }
    }
  };

  let body = res.text().await.map_err(|_| 500u16)?;
  let data: Value = serde_json::from_str(&body).map_err(|_| 500u16)?;

  Ok(data)
}
