use tauri::TitleBarStyle::Overlay;
use tauri::{Manager, Runtime, Window, WindowBuilder, WindowUrl};

use crate::store::preference::PreferenceStore;
use crate::store::{WindowSize, PREFERENCES, WINDOW_SIZE};
use crate::window_ext::WindowExt;

pub fn create_main_window<R, M>(manager: &M) -> Window<R>
where
  R: Runtime,
  M: Manager<R>,
{
  let store = PreferenceStore::new(
    WINDOW_SIZE,
    PREFERENCES,
    WindowSize {
      width: 1600u32,
      height: 1000u32,
    },
  )
  .unwrap();

  let mut window_size = store.get().unwrap();
  println!("{:?}", window_size);

  if window_size.width < 1000 {
    window_size.width = 1000;
  }

  if window_size.height < 600 {
    window_size.height = 600;
  }

  let window = WindowBuilder::new(manager, "main", WindowUrl::App("index.html".into()))
    .fullscreen(false)
    .resizable(true)
    .title("Manager")
    .inner_size(window_size.width as f64, window_size.height as f64)
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
    .build()
    .unwrap();

  window.position_traffic_lights(20., 42.);
  let _ = window.eval("window.location.hash = '#/login'");
  return window;
}
