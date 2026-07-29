const ERROR_MAP = {
  'Invalid login credentials':            '이메일 또는 비밀번호가 올바르지 않습니다.',
  'Email not confirmed':                  '이메일 인증이 완료되지 않았습니다. 받은 편지함을 확인해 주세요.',
  'User already registered':              '이미 가입된 이메일입니다.',
  'Password should be at least 6':        '비밀번호는 6자 이상이어야 합니다.',
  'Signup requires a valid password':     '유효한 비밀번호를 입력해 주세요.',
  'over_email_send_rate_limit':           '잠시 후 다시 시도해 주세요.',
  'Email rate limit exceeded':            '이메일 발송 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.',
  'For security purposes, you can only': '보안을 위해 잠시 후 다시 시도해 주세요.',
  'Token has expired or is invalid':      '링크가 만료되었거나 유효하지 않습니다. 다시 요청해 주세요.',
  'User not found':                       '등록되지 않은 이메일입니다.',
  'Email link is invalid or has expired': '이메일 링크가 만료되었거나 유효하지 않습니다.',
  '가입이 허용되지 않은 이메일':          '가입이 허용되지 않은 이메일입니다. 관리자에게 문의하세요.',
};

export function getKoreanError(error) {
  if (!error) return '알 수 없는 오류가 발생했습니다.';
  const msg = typeof error === 'string' ? error : (error.message ?? '');

  for (const [key, korean] of Object.entries(ERROR_MAP)) {
    if (msg.includes(key)) return korean;
  }

  if (import.meta.env.PROD) {
    return '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  }
  return msg || '알 수 없는 오류가 발생했습니다.';
}
