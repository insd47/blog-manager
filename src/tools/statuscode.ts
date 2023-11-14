export default function statusCodeToMessage(code: number) {
  // 400 ~ 499
  if (code === 401) return "인증되지 않은 사용자입니다.";
  if (code === 403) return "접근 권한이 없습니다.";
  if (code === 404) return "페이지를 찾을 수 없습니다.";
  if (code >= 400 && code < 500) return "요청 형식이 올바르지 않습니다.";

  // 500 ~ 599
  if (code === 500) return "요청을 처리하는 중 오류가 발생했습니다.";
  if (code === 503) return "현재 서비스를 이용할 수 없습니다.";
  if (code >= 500 && code < 600)
    return "요청을 처리하는 중 오류가 발생했습니다.";

  // 600
  if (code === 600) return "서버와의 연결이 원활하지 않습니다.";

  return false;
}
