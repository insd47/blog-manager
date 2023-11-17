import { useTheme } from "@emotion/react";
import { Button, Textfield } from "@insd47/library";
import { useEffect, useRef, useState } from "react";

import styles from "./styles.module.scss";

import Logo from "./logo";

import bgDark from "./assets/bg-dark.png";
import bgDark2x from "./assets/bg-dark@2x.png";
import bgDark3x from "./assets/bg-dark@3x.png";
import bgLight from "./assets/bg-light.png";
import bgLight2x from "./assets/bg-light@2x.png";
import bgLight3x from "./assets/bg-light@3x.png";

import { Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/tauri";
import { API_USER_LOGIN } from "@/tools/commands";
import statusCodeToMessage from "@/tools/statuscode";

type FieldType = "email" | "password";

type FormData = {
  value: string;
  isValid: boolean;
  error: boolean;
};

export default function Login() {
  const { mode } = useTheme();
  const emailRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Record<FieldType, FormData>>({
    email: { value: "", isValid: false, error: false },
    password: { value: "", isValid: false, error: false },
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  useEffect(() => {
    let newError = "";
    if (formData.email.error) newError = "이메일 주소가 올바르지 않습니다.";
    setError(newError);
  }, [formData]);

  const handleInputChange = (type: FieldType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        value,
        isValid: type == "email" ? validateEmail(value) : prev[type].isValid,
        error: false,
      },
    }));
  };

  const handleFocus = (type: FieldType) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], error: false },
    }));
  };

  const handleBlur = (type: FieldType) => {
    if (
      type === "email" &&
      !formData.email.isValid &&
      formData.email.value.length > 0
    ) {
      setFormData((prev) => ({
        ...prev,
        email: { ...prev.email, error: true },
      }));
    }
  };

  const sendRequest = async () => {
    setIsLoading(true);

    const status = (await invoke(API_USER_LOGIN, {
      email: formData.email.value,
      password: formData.password.value,
    }).catch((e) => e as number)) as number;

    if (status == 401) {
      setError("이메일 주소 또는 비밀번호가 올바르지 않습니다.");
      setFormData({
        email: { ...formData.email, error: true },
        password: { ...formData.password, error: true },
      });
      emailRef.current?.focus();
    } else if (status === 403) {
      setError("아직 승인되지 않은 계정입니다.");
    } else {
      const message = statusCodeToMessage(status);
      if (message) setError(message);
    }

    setIsLoading(false);
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <header data-tauri-drag-region />
        <Logo />
        <img
          src={mode === "dark" ? bgDark : bgLight}
          srcSet={
            mode === "dark"
              ? `${bgDark2x} 2x, ${bgDark3x} 3x`
              : `${bgLight2x} 2x, ${bgLight3x} 3x`
          }
        />
      </div>
      <div className={styles.body}>
        <form
          className={styles.inputs}
          onSubmit={(e) => {
            e.preventDefault();
            sendRequest();
          }}
        >
          <Textfield
            stretch
            ref={emailRef}
            placeholder="이메일 주소"
            type="email"
            onFocus={() => handleFocus("email")}
            error={formData.email.error}
            onBlur={() => handleBlur("email")}
            value={formData.email.value}
            onChange={(e) => handleInputChange("email", e.target.value)}
            bottom={10}
          />
          <Textfield
            stretch
            placeholder="비밀번호"
            type="password"
            onFocus={() => handleFocus("password")}
            error={formData.password.error}
            value={formData.password.value}
            onChange={(e) => handleInputChange("password", e.target.value)}
            bottom={20}
          />
          <Button
            formType="submit"
            stretch
            type="filled"
            icon="login"
            loading={isLoading}
            disabled={!formData.email.isValid || formData.password.value === ""}
          >
            로그인
          </Button>
        </form>
        <p className={styles.error}>{error}</p>
        <div className={styles.seperator}>
          <span>또는</span>
        </div>
        <div className={styles.buttons}>
          <Link to="/login/register">
            <Button size="small">권한 요청하기</Button>
          </Link>
          <Button size="small">비밀번호 찾기</Button>
        </div>
      </div>
    </main>
  );
}
