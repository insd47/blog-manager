import { Icon, Button, Textfield } from "@insd47/library";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "./styles.module.scss";

type FieldType = "email" | "name" | "password" | "passwordConfirm";

type FormData = {
  value: string;
  isValid: boolean;
  error: boolean;
};

const validateEmail = (email: string) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const validateName = (name: string) =>
  /^[A-Za-z가-힣0-9ㄱ-ㅎㅏ-ㅣ]*$/u.test(name) &&
  name.length >= 2 &&
  name.length <= 64;
const validatePassword = (password: string) =>
  /^(?:(?=.*[a-zA-Z])(?=.*[0-9])|(?=.*[a-zA-Z])(?=.*[~₩!@#$%^&*()_])|(?=.*[0-9])(?=.*[~₩!@#$%^&*()_]))[^\\s]+$/.test(
    password
  ) &&
  password.length >= 8 &&
  password.length <= 64;

export default function Register() {
  const [formData, setFormData] = useState<Record<FieldType, FormData>>({
    email: { value: "", isValid: false, error: false },
    name: { value: "", isValid: false, error: false },
    password: { value: "", isValid: false, error: false },
    passwordConfirm: { value: "", isValid: false, error: false },
  });
  const [globalError, setGlobalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let newError = "";
    if (formData.email.error) newError = "이메일 주소가 올바르지 않습니다.";
    else if (formData.name.error) newError = "이름이 올바르지 않습니다.";
    else if (formData.passwordConfirm.error) {
      if (!validatePassword(formData.password.value))
        newError = "비밀번호가 올바르지 않습니다.";
      else newError = "비밀번호가 일치하지 않습니다.";
    } else if (formData.password.error)
      newError = "비밀번호가 올바르지 않습니다.";

    setGlobalError(newError);
  }, [formData]);

  const handleChange = (field: FieldType, value: string) => {
    let isValid = false;

    switch (field) {
      case "email":
        isValid = validateEmail(value);
        break;
      case "name":
        isValid = validateName(value);
        break;
      case "password":
        isValid = validatePassword(value);

        const isConfirmValid = formData.passwordConfirm.value === value;
        setFormData((prev) => ({
          ...prev,
          passwordConfirm: {
            ...prev.passwordConfirm,
            isValid: isConfirmValid,
            error: isConfirmValid ? false : prev.passwordConfirm.error,
          },
        }));
        break;
      case "passwordConfirm":
        isValid = value === formData.password.value;
        break;
      default:
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: { value, isValid, error: isValid ? false : prev[field].error },
    }));
  };

  const handleFocus = (field: FieldType) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], error: false },
    }));
  };

  const handleBlur = (field: FieldType) => {
    if (!formData[field].isValid && formData[field].value.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], error: true },
      }));
    }

    if (field === "password" || field === "passwordConfirm") {
      const isPasswordValid = validatePassword(formData.password.value);
      const isConfirmValid =
        formData.passwordConfirm.value === formData.password.value;

      setFormData((prev) => ({
        ...prev,
        password: {
          ...prev.password,
          error: !isPasswordValid && formData.password.value.length > 0,
        },
        passwordConfirm: {
          ...prev.passwordConfirm,
          error: !isConfirmValid && formData.passwordConfirm.value.length > 0,
        },
      }));
    }
  };

  const isFormValid = Object.values(formData).every((field) => field.isValid);

  return (
    <main className={styles.main}>
      <header className={styles.header} data-tauri-drag-region />
      <div className={styles.title}>
        <Link to="/login">
          <Icon pressable buttonSize={36} type="arrow-1-left" />
        </Link>
        <h1 className="text-title-3">권한 요청하기</h1>
      </div>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          setIsLoading(true);
        }}
      >
        <div className={styles.inputs}>
          {[
            {
              label: "이메일 주소",
              type: "email",
              placeholder: "이메일 주소",
              field: "email",
            },
            {
              label: "이름 | 2자 이상 | 한글, 영어 및 숫자 포함 가능",
              type: "text",
              placeholder: "이름",
              field: "name",
            },
            {
              label:
                "비밀번호 | 8자 이상 | 영어, 숫자, 특수문자 중 2가지 이상 포함",
              type: "password",
              placeholder: "비밀번호",
              field: "password",
            },
            {
              label: "비밀번호 확인",
              type: "password",
              placeholder: "비밀번호 확인",
              field: "passwordConfirm",
            },
          ].map(({ label, type, placeholder, field }) => {
            const keyField = field as FieldType;

            return (
              <Textfield
                key={field}
                label={label}
                type={type}
                placeholder={placeholder}
                stretch
                value={formData[keyField].value}
                error={
                  formData[keyField].error ||
                  (keyField === "password" && formData.passwordConfirm.error)
                }
                onChange={(e) => handleChange(keyField, e.target.value)}
                onFocus={() => handleFocus(keyField)}
                onBlur={() => handleBlur(keyField)}
              />
            );
          })}
        </div>
        <p className={styles.error}>{globalError}</p>
        <div style={{ flex: 1 }} />
        <div className={styles.buttons}>
          <Button
            type="filled"
            formType="submit"
            loading={isLoading}
            disabled={!isFormValid}
          >
            관리 계정 요청하기
          </Button>
          <p className="text-ui-3">
            관리자의 승인 후 계정을 사용할 수 있습니다.
          </p>
        </div>
      </form>
    </main>
  );
}
