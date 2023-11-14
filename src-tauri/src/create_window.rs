use tauri::TitleBarStyle::Overlay;
use tauri::{Manager, Runtime, Window, WindowBuilder, WindowUrl};

use crate::store::preference::PreferenceStore;
use crate::store::{WindowPreference, PREFERENCES, WINDOW_PREFERENCE};
use crate::window_ext::WindowExt;

pub fn create_main_window<R, M>(manager: &M) -> Window<R>
where
  R: Runtime,
  M: Manager<R>,
{
  let store = PreferenceStore::new(
    WINDOW_PREFERENCE,
    PREFERENCES,
    WindowPreference {
      width: 1600u32,
      height: 1000u32,
      maximized: false,
      fullscreen: false,
    },
  )
  .unwrap();

  let mut preference = store.get().unwrap();

  if preference.width < 1000 {
    preference.width = 1000;
  }

  if preference.height < 600 {
    preference.height = 600;
  }

  let _ = store.save(preference);

  let window = WindowBuilder::new(manager, "main", WindowUrl::App("index.html".into()))
    .fullscreen(false)
    .resizable(true)
    .title("Manager")
    .inner_size(preference.width as f64, preference.height as f64)
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
