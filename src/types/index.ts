export const RESPONSE_STATUS = {
  loading: 'loading',
  pending: 'pending',
  success: 'success',
  error: 'error',
} as const;

export type ResponseStatus = (typeof RESPONSE_STATUS)[keyof typeof RESPONSE_STATUS];
