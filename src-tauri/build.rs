use std::env;

fn main() {
  dotenv::dotenv().ok();

  for (key, value) in env::vars() {
    // `CARGO_*` 환경 변수는 내부적으로 Cargo에 의해 사용되므로 건드리지 않습니다.
    if !key.starts_with("CARGO_") {
      // 환경 변수를 컴파일 타임 환경 변수로 설정합니다.
      println!("cargo:rustc-env={}={}", key, value);
    }
  }

  tauri_build::build()
}
