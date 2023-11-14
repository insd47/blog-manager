// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use api::request_with_token;
use reqwest::Method;
use store::{preference::PreferenceStore, WindowSize, PREFERENCES, WINDOW_SIZE};
use tauri::{Manager, WindowEvent};

mod window_ext;
use window_ext::WindowExt;

mod create_window;
use create_window::{create_login_window, create_main_window};

mod api;
mod store;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      // user api
      api::user::api_user_login,
      api::user::api_user_info,
      api::user::api_user_logout,
    ])
    .setup(|app| {
      tauri::async_runtime::block_on(async {
        let url = format!("{}/api/user/info", env!("API_URL"));

        match request_with_token(url.as_str(), Method::GET, None).await {
          Ok(_) => (),
          Err(e) => {
            if e >= 400u16 && e < 500u16 {
              let login_window = create_login_window(app);
              app.manage(login_window);
              return ();
            }
            ()
          }
        }

        let main_window = create_main_window(app);
        app.manage(main_window);
      });

      Ok(())
    })
    .on_window_event(|e| {
      if let WindowEvent::Resized(..) = e.event() {
        let win = e.window();
        win.position_traffic_lights(20., 42.);

        if win.label() == "main" {
          match win.inner_size() {
            Ok(size) => {
              let size = size.to_logical(win.scale_factor().unwrap());

              let window_size = WindowSize {
                width: size.width,
                height: size.height,
              };

              println!("{:?}", window_size);

              let store = PreferenceStore::new(WINDOW_SIZE, PREFERENCES, window_size).unwrap();
              let _ = store.save(window_size);
            }
            Err(_) => {}
          }
        }
      }

      if let WindowEvent::ThemeChanged(..) = e.event() {
        let win = e.window();
        win.position_traffic_lights(20., 42.);
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
