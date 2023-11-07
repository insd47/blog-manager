use tauri::{Runtime, Window};

pub trait WindowExt {
  #[cfg(target_os = "macos")]
  fn position_traffic_lights(&self, x: f64, title_bar_height: f64);
}

impl<R: Runtime> WindowExt for Window<R> {
  #[cfg(target_os = "macos")]
  fn position_traffic_lights(&self, x: f64, title_bar_height: f64) {
    use cocoa::appkit::{NSView, NSWindow, NSWindowButton};
    use cocoa::foundation::NSRect;

    let window = self.ns_window().unwrap() as cocoa::base::id;

    unsafe {
      let close = window.standardWindowButton_(NSWindowButton::NSWindowCloseButton);
      let miniaturize = window.standardWindowButton_(NSWindowButton::NSWindowMiniaturizeButton);
      let zoom = window.standardWindowButton_(NSWindowButton::NSWindowZoomButton);
      let traffic_lights = vec![close, miniaturize, zoom];

      let title_bar_container_view = close.superview().superview();
      let button_height = NSView::frame(zoom).size.height;

      let mut title_bar_rect = NSView::frame(title_bar_container_view);
      title_bar_rect.size.height = title_bar_height;
      title_bar_rect.origin.y = NSView::frame(window).size.height - title_bar_height;
      let _: () = msg_send![title_bar_container_view, setFrame: title_bar_rect];

      let space_between = NSView::frame(miniaturize).origin.x - NSView::frame(close).origin.x;

      for (i, button) in traffic_lights.into_iter().enumerate() {
        let mut rect: NSRect = NSView::frame(button);
        rect.origin.x = x + (i as f64 * space_between);
        rect.origin.y = (title_bar_height - button_height) / 2.;
        button.setFrameOrigin(rect.origin);
      }
    }
  }
}
