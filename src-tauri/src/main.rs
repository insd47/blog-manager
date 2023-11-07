// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

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
      api::user::api_user_login,
      api::user::api_user_info,
    ])
    .setup(|app| {
      tauri::async_runtime::block_on(async {
        match api::user::api_user_info().await {
          Ok(_) => {
            let main_window = create_main_window(app);
            app.manage(main_window);
          }
          Err(_) => {
            let login_window = create_login_window(app);
            app.manage(login_window);
          }
        }
      });

      Ok(())
    })
    .on_window_event(|e| {
      if let WindowEvent::Resized(..) = e.event() {
        let win = e.window();
        win.position_traffic_lights(20., 42.);
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
