use tauri::TitleBarStyle::Overlay;
use tauri::{Manager, Runtime, Window, WindowBuilder, WindowUrl};

use crate::window_ext::WindowExt;

pub fn create_main_window<R, M>(manager: &M) -> Window<R>
where
  R: Runtime,
  M: Manager<R>,
{
  let window = WindowBuilder::new(manager, "main", WindowUrl::App("index.html".into()))
    .fullscreen(false)
    .resizable(true)
    .title("Manager")
    .inner_size(1600., 1000.)
    .min_inner_size(1000., 600.)
    .title_bar_style(Overlay)
    .hidden_title(true)
    .build()
    .unwrap();

  window.position_traffic_lights(20., 42.);

  return window;
}

pub fn create_login_window<R, M>(manager: &M) -> Window<R>
where
  R: Runtime,
  M: Manager<R>,
{
  let window = WindowBuilder::new(manager, "login", WindowUrl::App("index.html".into()))
    .fullscreen(false)
    .resizable(false)
    .title("Login")
    .inner_size(400., 600.)
    .title_bar_style(Overlay)
    .hidden_title(true)
    .visible(false)
    .build()
    .unwrap();

  window.position_traffic_lights(20., 42.);
  let _ = window.eval("window.location.hash = '#/login'");
  let _ = window.show();
  return window;
}
